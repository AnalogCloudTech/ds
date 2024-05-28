import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { HubspotService } from './hubspot.service';
import { CreateTicketDto } from './dto/createTicket.dto';
import { UpdateContactDto } from './dto/create-contact.dto';
import { Public } from '@/auth/auth.service';
import { UpdateCreditsAndPackagesDto } from './dto/updateCreditsAndPackages.dto';
import {
  AddContactToWorkFlowDto,
  ContactToWorkFlowDto,
} from './dto/addContactToWorkFlow.dto';
import {
  ContactDto,
  UpdateAfyPasswordDto,
  UpdateProfileAvatarDto,
} from './dto/contact.dto';
import { ValidatePasswordConfirmationPipe } from '@/legacy/dis/legacy/hubspot/pipes/validate-password-confirmation.pipe';
import { TransformPasswordEncryptedPipe } from '@/legacy/dis/legacy/hubspot/pipes/transform-password-encrypted.pipe';
import { BlogPost } from '@hubspot/api-client/lib/codegen/cms/blogs/blog_posts/api';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { DateTime } from 'luxon';
import { CONTEXT_HUBSPOT_PASSWORD } from '@/internal/common/contexts';
import {
  DealProperties,
  FormSubmissionObject,
  HSDataObject,
  MessageErrorObj,
  QuoteLink,
} from './domain/types';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import {
  ProductVerificationStatus,
  VerifyProductDto,
} from './dto/products.dto';
import { FormSubmissionDto } from '@/legacy/dis/legacy/hubspot/dto/form-submission.dto';
import { CreateQuotationDto } from '@/legacy/dis/legacy/hubspot/dto/create-quotation.dto';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/companies/api';

@Controller({ path: 'hubspot', version: '1' })
export class HubspotController {
  constructor(
    private readonly hubspotService: HubspotService,
    private readonly logger: Logger,
  ) {}

  //TO-DO: Remove this endpoint if not needed
  @Post('meeting')
  register() {
    return 'this endpoint is deprecated please use the Calendar module, refer to api documentation for more info';
  }

  @Public()
  @Post('ticket')
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.hubspotService.createTicket(createTicketDto);
  }

  @Post('/auto-login-token')
  public getAutoLoginToken(@Body('id') id: string) {
    return this.hubspotService.findOrCreateAutoLoginToken(id);
  }

  @Post('/authenticate')
  public authenticate(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.hubspotService.authenticate(email, password);
  }

  @Post('/contact')
  public async createOrUpdateContact(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body() contact: ContactDto,
  ): Promise<string> {
    this.logger.log(
      {
        payload: {
          step: 'start',
          message: 'before update',
          method: 'HubspotController@createOrUpdateContact',
          executedBy: customer,
          usageDate: DateTime.now(),
        },
      },
      CONTEXT_HUBSPOT_PASSWORD,
    );

    const createOrUpdateContact =
      await this.hubspotService.createOrUpdateContact(contact);

    this.logger.log(
      {
        payload: {
          step: 'end',
          message: 'after update',
          method: 'HubspotController@createOrUpdateContact',
          executedBy: customer,
          usageDate: DateTime.now(),
        },
      },
      CONTEXT_HUBSPOT_PASSWORD,
    );

    return createOrUpdateContact;
  }

  @Post('/contact/packagesandcredits')
  UpdateCreditsAndPackages(@Body() data: UpdateCreditsAndPackagesDto) {
    return this.hubspotService.updateCreditsAndPackages(data);
  }

  @Post('/contact/workflow')
  addContactToWorkFlow(@Body() data: AddContactToWorkFlowDto) {
    return this.hubspotService.addContactToWorkFlow(data);
  }

  @Public()
  @Patch('/contact/:ticketId')
  public updateContactByTicketId(
    @Param('ticketId') id: string,
    @Body() contact: UpdateContactDto,
  ): Promise<string> {
    return this.hubspotService.updateContactByTicketId(id, contact);
  }

  @Get('/contact/:contactEmail')
  async getContactDetailsByEmail(
    @Param('contactEmail') contactEmail: string,
  ): Promise<object> {
    return this.hubspotService.getContactDetailsByEmail(contactEmail);
  }

  @Get('/customer-is-admin/:email')
  async isAdmin(@Param('email') email: string) {
    const isAdmin: boolean = await this.hubspotService.isAdminByEmail(email);

    return { isAdmin };
  }

  @Post('/update-afy-password')
  public async updateAfyPassword(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(
      ValidationPipe,
      ValidatePasswordConfirmationPipe,
      TransformPasswordEncryptedPipe,
    )
    dto: UpdateAfyPasswordDto,
  ): Promise<string> {
    this.logger.log(
      {
        payload: {
          step: 'start',
          message: 'before update',
          method: 'HubspotController@updateAfyPassword',
          executedBy: customer,
          usageDate: DateTime.now(),
        },
      },
      CONTEXT_HUBSPOT_PASSWORD,
    );
    const updateAfyPassword = await this.hubspotService.updateAfyPassword(dto);

    this.logger.log(
      {
        payload: {
          step: 'end',
          message: 'after update',
          method: 'HubspotController@updateAfyPassword',
          executedBy: customer,
          usageDate: DateTime.now(),
        },
      },
      CONTEXT_HUBSPOT_PASSWORD,
    );

    return updateAfyPassword;
  }

  @Post('/update-profile-avatar')
  public updateProfileAvatar(
    @Body(TransformPasswordEncryptedPipe)
    dto: UpdateProfileAvatarDto,
  ): Promise<string> {
    return this.hubspotService.updateProfileAvatar(dto);
  }

  @Get('/blog-posts')
  async getAllBlogPosts(): Promise<Array<BlogPost>> {
    return this.hubspotService.getAllBlogPosts();
  }

  @Post('auto-enroll-hs-contact-workflow')
  async autoEnrollHsContactWorkflow(
    @Body(ValidationPipe) data: ContactToWorkFlowDto,
  ): Promise<MessageErrorObj> {
    return this.hubspotService.getListContactsWithWorkflow(data);
  }

  @Post('verify-product')
  async verifyHubspotProduct(
    @Body(ValidationPipe)
    body: VerifyProductDto,
  ): Promise<ProductVerificationStatus> {
    return this.hubspotService.verifyProduct(body);
  }

  @Post('submit-form')
  async submitHSForms(
    @Body(ValidationTransformPipe) dto: FormSubmissionDto,
  ): Promise<FormSubmissionObject> {
    return this.hubspotService.submitHSForms(dto);
  }

  @Post('create-quotation')
  async createQuotation(
    @Body(ValidationTransformPipe) dto: CreateQuotationDto,
  ): Promise<QuoteLink> {
    return this.hubspotService.createQuotation(dto);
  }

  @Get('deal/:subscriptionId')
  async getDealBySubscriptionId(
    @Param('subscriptionId') subscriptionId: number,
  ): Promise<
    HSDataObject<Partial<DealProperties>> | SimplePublicObject | null
  > {
    return this.hubspotService.getDealBySubscriptionId(subscriptionId);
  }
}
