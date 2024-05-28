import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  MAGAZINE_DOMAIN,
  PERMANENT_LINKS_TURN_OVER,
} from '@/referral-marketing/magazines/constants';
import { sleep } from '@/internal/utils/functions';
import { MagazineDocument } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FlippingBookService } from '@/integrations/flippingbook/services/flippingbook.service';
import { GeneratedMagazineDocument } from '@/referral-marketing/magazines/schemas/generated-magazine.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomersService } from '@/customers/customers/customers.service';

/**
 * This processor is responsible for updating permanent links with temporary files in flippingBook service
 *
 * @disclaimer This processor uses sleep function so CMS server don't get overwhelmed with requests
 */
@Processor(PERMANENT_LINKS_TURN_OVER)
export class AdminPermanentLinkQueueProcessor {
  constructor(
    private readonly magazinesService: MagazinesService,
    private readonly generatedMagazinesService: GeneratedMagazinesService,
    private readonly flippingBookService: FlippingBookService,
    private readonly customerService: CustomersService,
  ) {}

  @Process({ concurrency: 1 })
  async handleJob(job: Job<{ magazine: MagazineDocument }>) {
    try {
      const magazine = job.data.magazine;
      const generatedMagazine = await this.generatedMagazinesService.findOneGM(
        {
          magazine: magazine._id,
        },
        { populate: ['customer'] },
      );
      if (!generatedMagazine || !generatedMagazine.url) {
        throw new Error(
          `couldn't find generated magazine in magazine monthly cronjob`,
        );
      }

      this.generatedMagazineValidation(generatedMagazine);

      const customer = <CustomerDocument>generatedMagazine.customer;
      const permanentUrl = await this.checkFlippingBookPermanentUrl(customer);
      const hashId = this.flippingBookService.getHashIdFromUrl(permanentUrl);
      const magazineName = `${customer.firstName} ${customer.lastName} - Home Sweet Home`;

      await this.flippingBookService.updatePublicationByHashId(hashId, {
        url: generatedMagazine.url,
        name: magazineName,
        description: magazineName,
        domain: MAGAZINE_DOMAIN,
      });

      await sleep(15000);
    } catch (error) {
      throw new HttpException(
        {
          message:
            'could not find magazine details in magazine monthly cronjob',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generatedMagazineValidation(gm: GeneratedMagazineDocument) {
    const validations = {
      'could not find generated magazine': () => !gm,
      'could not find generated magazine url': () => !gm.url,
      'could not find generated magazine customer': () => !gm.customer,
    };

    Object.entries(validations).forEach(([errorMessage, isValid]) => {
      if (isValid()) {
        throw new Error(errorMessage);
      }
    });
  }

  /**
   * This function checks if flipping book permanent url is present in customer flipping book preferences
   * If not it will update it with temporary url
   *
   * @param customer - customer document
   *
   * @returns - permanent url of RMM
   */
  private async checkFlippingBookPermanentUrl(
    customer: CustomerDocument,
  ): Promise<string> {
    const fbp = customer.flippingBookPreferences;
    let permanentUrl = fbp?.permanentPublicationUrl;

    if (!permanentUrl && fbp?.publicationUrl) {
      permanentUrl = fbp.publicationUrl;
      await this.customerService.updateFlippingBookPreferences(customer._id, {
        permanentPublicationId: fbp.publicationId,
        permanentPublicationName: fbp.publicationName,
        permanentRawFileUrl: fbp.rawFileUrl,
        permanentPublicationUrl: fbp.publicationUrl,
      });
    }

    if (!permanentUrl) {
      throw new Error('could not find flipping book permanent publication url');
    }

    return permanentUrl;
  }
}
