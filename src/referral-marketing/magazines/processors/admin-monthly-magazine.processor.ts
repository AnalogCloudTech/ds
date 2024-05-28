import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MONTHLY_TURN_OVER_MAGAZINE_QUEUE } from '@/referral-marketing/magazines/constants';
import { sleep } from '@/internal/utils/functions';
import { MagazineDocument } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CmsService } from '@/cms/cms/cms.service';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Selection } from '@/referral-marketing/magazines/domain/types';
import { enumToMonth } from '@/referral-marketing/magazines/helpers/month.helper';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_MONTHLY_MAGAZINE_PROCESSOR } from '@/internal/common/contexts';
/**
 * This processor is responsible for creating a new magazine from the data of last month magazine
 *
 * @disclaimer This processor uses sleep function so CMS server don't get overwhelmed with requests
 */
@Processor(MONTHLY_TURN_OVER_MAGAZINE_QUEUE)
export class AdminMonthlyMagazineProcessor {
  constructor(
    private readonly cmsService: CmsService,
    private readonly magazinesService: MagazinesService,
    private readonly generatedMagazinesService: GeneratedMagazinesService,
    private readonly logger: Logger,
  ) {}

  @Process({ concurrency: 1 })
  async handleJob(job: Job<MagazineDocument>) {
    try {
      const { baseReplacers, customer, month, year } = job.data;
      let { selections } = job.data;

      const extendedMonthValue = enumToMonth(month);

      if (!extendedMonthValue) {
        throw new Error('could not find extended month value');
      }

      const magazineDetails = await this.cmsService.magazineData({
        month: extendedMonthValue,
        year,
      });

      if (!magazineDetails?.length) {
        throw new HttpException(
          {
            message: `couldn't find magazine details in magazine monthly cronjob`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const {
        id,
        attributes: {
          month: monthCMS,
          year: yearCMS,
          pdf: {
            data: {
              attributes: { url },
            },
          },
        },
      } = magazineDetails[0];

      // TODO: all logic of cloning could become be used in create
      await this.magazinesService.adminCreate({
        magazineId: id,
        baseReplacers,
        customer,
        month: monthCMS,
        year: yearCMS,
        contentUrl: url,
        createdByAutomation: true,
      });

      // TODO: remove this method after april 2023 magazines
      selections = this.changeSelectionKeywords(selections);

      for await (const selection of selections) {
        selection.formKeyword = selection?.formKeyword?.trim();

        if (selection.formKeyword === 'frontInsideCover-option-1') {
          const defaultValue =
            magazineDetails[0]?.attributes?.frontInsideCover[0]?.defaultText;

          selection.dynamicFields.forEach(({ keyword }, idx) => {
            if (keyword === 'frontInsideCoverText') {
              selection.dynamicFields[idx].value = defaultValue?.replace(
                /(?:\r\n|\r|\n)/g,
                '<br />',
              );
            }
          });
        }

        // TODO: need to refactor this update function
        await this.magazinesService.update(
          <CustomerDocument>customer,
          yearCMS,
          monthCMS,
          {
            selection,
          },
        );
        await sleep(1000);
      }

      await this.generatedMagazinesService.create(
        <CustomerDocument>customer,
        { year: yearCMS, month: monthCMS, createdByAutomation: true },
        true,
        false,
      );

      await sleep(15000);
    } catch (err) {
      throw new HttpException(
        {
          message: `couldn't find magazine details in magazine monthly cronjob`,
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TODO: remove this after april 2023 magazines
  // backInsideCover-option-3 : changed "listingImage" to "listingImageJustSold"
  // backInsideCover-option-4: listingImage ==> listingImageJustListed
  // backCover-option-5: listingImage ==> listingImageJustListed
  // backCover-option-4: listingImage ==>listingImageJustSold
  private changeSelectionKeywords(selections: Selection[]) {
    try {
      const newSelection = selections.map((selection) => {
        if (selection.formKeyword === 'backInsideCover-option-3') {
          selection.dynamicFields.forEach(({ keyword }, idx) => {
            if (keyword === 'listingImage') {
              selection.dynamicFields[idx].keyword = 'listingImageJustSold';
            }
          });
        }

        if (selection.formKeyword === 'backInsideCover-option-4') {
          selection.dynamicFields.forEach(({ keyword }, idx) => {
            if (keyword === 'listingImage') {
              selection.dynamicFields[idx].keyword = 'listingImageJustListed';
            }
          });
        }

        if (selection.formKeyword === 'backCover-option-5') {
          selection.dynamicFields.forEach(({ keyword }, idx) => {
            if (keyword === 'listingImage') {
              selection.dynamicFields[idx].keyword = 'listingImageJustListed';
            }
          });
        }

        if (selection.formKeyword === 'backCover-option-4') {
          selection.dynamicFields.forEach(({ keyword }, idx) => {
            if (keyword === 'listingImage') {
              selection.dynamicFields[idx].keyword = 'listingImageJustSold';
            }
          });
        }

        return selection;
      });
      return newSelection;
    } catch (err) {
      this.logger.log(
        {
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            message: `error in changeSelectionKeywords ${err}`,
          },
        },
        CONTEXT_MONTHLY_MAGAZINE_PROCESSOR,
      );
      return selections;
    }
  }
}
