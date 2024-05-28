import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { first, get, join, pick, split, union, upperFirst } from 'lodash';
import * as hubspot from '@hubspot/api-client';
import { Client as HubspotClient } from '@hubspot/api-client';
import parsePhoneNumber from 'libphonenumber-js';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { Uuid4 } from 'id128';
import {
  Customer,
  State,
  Subscription,
} from '@/payments/chargify/domain/types';
import {
  CreateTicketDto,
  CreateTicketResponseDto,
} from './dto/createTicket.dto';
import {
  ContactDto,
  UpdateAfyPasswordDto,
  UpdateProfileAvatarDto,
} from './dto/contact.dto';

import { RecordingCompletedPayloadObjectDto } from '@/legacy/dis/legacy/zoom/dto/recording-completed.dto';
import { UpdateCreditsAndPackagesDto } from './dto/updateCreditsAndPackages.dto';
import { CallDisposition } from './dto/callDispositions';
import {
  millisecondsToHuman,
  toTwoDigits,
} from '@/legacy/dis/legacy/common/utils/timeFormatters';
import {
  timeStampToHumanReadable,
  TimeZones,
} from '@/legacy/dis/legacy/common/utils/dateFormatters';
import { BlogPost } from '@hubspot/api-client/lib/codegen/cms/blogs/blog_posts/api';
import {
  AddToListResponseV1,
  AssociationType,
  ContactResponse,
  ContactV1,
  DealProperties,
  FormSubmissionObject,
  HSDataObject,
  HubspotObjectTypes,
  ListOfContacts,
  MessageErrorObj,
  Pipeline,
  QuoteLink,
  QuotePayloadType,
} from '@/legacy/dis/legacy/hubspot/domain/types';
import { capitalizeFirstLetter } from '@/internal/utils/string';
import { convertToHSDate } from '@/internal/common/utils/dateFormatters';
import { LineItemDto } from '@/legacy/dis/legacy/hubspot/dto/line-item.dto';
import {
  DEAL_DEAL_STAGE_ID,
  DEAL_PIPELINE_ID,
  HUBSPOT_QUOTE_LINK_SENDER_QUEUE,
  VERIFICATION_STATUS,
  WORKFLOW_ID,
} from '@/legacy/dis/legacy/hubspot/constants';
import {
  CreateRmPrintTicketDto,
  CreateRmPrintTicketResponseDto,
} from './dto/createRmPrintTicket.dto';
import { MonthsLong } from '@/internal/utils/date';
import { DateTime } from 'luxon';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { SimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/objects/api';
import {
  CONTEXT_CHARGIFY_DEAL,
  CONTEXT_HUBSPOT,
  CONTEXT_HUBSPOT_PASSWORD,
  CONTEXT_HUBSPOT_QUOTE,
} from '@/internal/common/contexts';
import {
  AddContactToWorkFlowDto,
  ContactToWorkFlowDto,
  HsUrlDataDto,
} from './dto/addContactToWorkFlow.dto';
import { Property } from '@hubspot/api-client/lib/codegen/crm/properties/api';
import { sleep } from '@/internal/utils/functions';
import {
  ProductVerificationStatus,
  VerifyProductDto,
} from './dto/products.dto';
import { LoggerPayload } from '@/internal/utils/logger';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/companies/api';
import {
  HubspotPriceProperty,
  HubspotProductProperty,
} from '@/onboard/products/domain/types';
import { Axios } from 'axios';
import { FormSubmissionDto } from '@/legacy/dis/legacy/hubspot/dto/form-submission.dto';
import { CreateGuideOrderDto } from '@/guides/orders/dto/create-guide-order.dto';
import { CreateQuotationDto } from '@/legacy/dis/legacy/hubspot/dto/create-quotation.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PublicOwner } from '@hubspot/api-client/lib/codegen/crm/owners/model/publicOwner';
import http from 'http';
import { UpdateContactDto } from '@/legacy/dis/legacy/hubspot/dto/create-contact.dto';
import { AccountType } from '@/onboard/domain/types';

@Injectable()
export class HubspotService {
  constructor(
    private readonly configService: ConfigService,
    private readonly hubspotClient: HubspotClient,
    @Inject('APP_ENVIRONMENT') private readonly appEnv: string,
    @Inject('HTTP_HS_FORMS') private readonly httpForms: Axios,
    private readonly logger: Logger,
    @InjectQueue(HUBSPOT_QUOTE_LINK_SENDER_QUEUE)
    private hubspotQuoteQueue: Queue,
  ) {}

  static cleanName(name: string): string {
    if (!name || name === '' || name === 'anonymous') {
      return 'John Doe Zoom';
    }
    return name;
  }

  static cleanPhone(phone: string): string {
    const parsedPhone =
      phone.charAt(0) === '+'
        ? parsePhoneNumber('' + phone || '')
        : parsePhoneNumber('+' + phone || '');
    if (!parsedPhone || !parsedPhone.isValid()) {
      return null;
    }
    return parsedPhone.formatNational().replace(/[^0-9]/g, '');
  }

  public async findOrCreateAutoLoginToken(id: string): Promise<string | false> {
    let contact: Record<string, any>;
    try {
      contact = await this.hubspotClient.crm.contacts.basicApi.getById(id, [
        'afy_customer_login_token',
      ]);
      let afy_customer_login_token = get(contact, [
        'body',
        'properties',
        'afy_customer_login_token',
      ]) as string;
      if (!afy_customer_login_token) {
        afy_customer_login_token = Uuid4.generate().toCanonical();
        const properties = { afy_customer_login_token };
        await this.hubspotClient.crm.contacts.basicApi.update(id, {
          properties,
        });
      }
      return afy_customer_login_token;
    } catch (error) {
      return false;
    }
  }

  public async authenticate(email: string, password: string): Promise<boolean> {
    let contact: Record<string, any>;
    try {
      contact = await this.hubspotClient.crm.contacts.basicApi.getById(
        email,
        ['afy_password_encrypted'],
        [],
        false,
        'email',
      );
      const hash = get(
        contact,
        ['body', 'properties', 'afy_password_encrypted'],
        '',
      ) as string;
      return await bcrypt.compare(password, hash);
    } catch (error) {
      return false;
    }
  }

  async setContactOwnerIfNull(contactId: string, ownerId: string) {
    if (!contactId || !ownerId) {
      throw new HttpException(
        { message: `${contactId ? 'coachId' : 'contactId'} was not provided` },
        HttpStatus.BAD_REQUEST,
      );
    }

    const ownerProperty = 'hubspot_owner_id';
    const contact = await this.getContactById(contactId, [ownerProperty]);
    const ownerExists = get(contact, ['properties', ownerProperty]);
    if (ownerExists) {
      return;
    }
    const data = {
      properties: { [ownerProperty]: ownerId },
    };
    await this.updateContactById(contactId, data);
  }

  public async createOrUpdateContact(dto: ContactDto): Promise<string> {
    const email = dto.email;

    this.logger.log(
      {
        payload: {
          method: 'HubspotService@createOrUpdateContact',
          message: 'checking dto values',
          params: dto,
          usageDate: DateTime.now(),
        },
      },
      CONTEXT_HUBSPOT_PASSWORD,
    );

    try {
      const contactData = await this.getContactId(email);
      this.logger.log(
        {
          payload: {
            method: 'HubspotService@createOrUpdateContact',
            message: 'checking contactData',
            params: contactData,
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_HUBSPOT_PASSWORD,
      );
      if (contactData) {
        this.logger.log(
          {
            payload: {
              method: 'HubspotService@createOrUpdateContact',
              message: 'customer exists, update...',
              usageDate: DateTime.now(),
            },
          },
          CONTEXT_HUBSPOT_PASSWORD,
        );

        /** Update contact */
        const { body: contact } =
          await this.hubspotClient.crm.contacts.basicApi.update(
            email,
            { properties: { ...dto } },
            'email',
          );

        this.logger.log(
          {
            payload: {
              method: 'HubspotService@createOrUpdateContact',
              message: 'checking updated contact values',
              params: contact,
              usageDate: DateTime.now(),
            },
          },
          CONTEXT_HUBSPOT_PASSWORD,
        );

        return contact.id;
      }

      /** Create contact */
      this.logger.log(
        {
          payload: {
            method: 'HubspotService@createOrUpdateContact',
            message: 'contact doesnt exists. creating',
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_HUBSPOT_PASSWORD,
      );

      const { body: contact } =
        await this.hubspotClient.crm.contacts.basicApi.create({
          properties: { ...dto },
        });

      this.logger.log(
        {
          payload: {
            method: 'HubspotService@createOrUpdateContact',
            message: 'checking created contact values',
            params: contact,
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_HUBSPOT_PASSWORD,
      );
      return contact.id;
    } catch (err) {
      if (err instanceof Error) {
        throw new HttpException(
          { message: err.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async updateProfileAvatar(
    dto: UpdateProfileAvatarDto,
  ): Promise<string> {
    const email = dto.email;
    let contact: Record<string, any>;

    try {
      contact = await this.hubspotClient.crm.contacts.basicApi.update(
        email,
        { properties: { ...dto } },
        'email',
      );
      return get(contact, ['body', 'id']) as string;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getContactOwnerId(contactId: string): Promise<string | null> {
    const ownerProperty = 'hubspot_owner_id';
    const properties = [ownerProperty];

    const contact = await this.getContactById(contactId, properties);
    return get(contact, ['properties', ownerProperty], null) as string;
  }

  async updateRmUserProperties({
    email,
    isAfy,
    isRm,
  }: {
    email: string;
    isRm: boolean;
    isAfy: boolean;
  }) {
    if (!email) {
      throw new HttpException(
        { message: 'Email is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const id = await this.getContactId(email);
    if (!id) {
      throw new HttpException(
        { message: 'Contact not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    const properties = {
      rmAccess: 'rm_customer_status',
      bookAccess: 'afy_customer_status',
      hideBooks: 'afy_hide_books',
      isPilotCustomer: 'afy_pilot_customer',
    };

    return this.updateContactById(id, {
      properties: {
        [properties.rmAccess]: 'Active',
        [properties.bookAccess]: 'Active',
        [properties.hideBooks]: isAfy && isRm ? '' : 'Active',
        [properties.isPilotCustomer]: 'Yes',
      },
    });
  }

  async updateCreditsAndPackages(
    data: UpdateCreditsAndPackagesDto,
    type?: HubspotProductProperty | AccountType,
  ) {
    const isDentist =
      type === HubspotProductProperty.DENTIST_PRODUCT ||
      type === AccountType.DENTIST;
    const propertyNames = {
      packages: 'afy_package',
      credits: isDentist ? 'dentist_guide_credits' : 'afy_book_credits',
    };

    const packages = get(data, ['packages'], []);
    const credits = +get(data, ['credits'], 0);
    const requestProperties = [...Object.values(propertyNames)];
    const contact = await this.getContactById(data.id, requestProperties);
    const oldPackages = split(
      get(contact, ['properties', propertyNames.packages], ''),
      ';',
    ).filter(Boolean);
    const oldCredits = +get(contact, ['properties', propertyNames.credits], 0);
    const newCredits = oldCredits + credits;
    const newPackages = union(oldPackages, packages);
    const packagesString = join(newPackages, ';');
    const properties = {
      [propertyNames.packages]: packagesString.toString(),
      [propertyNames.credits]: newCredits.toString(),
    };

    if (this.appEnv !== 'production') {
      properties['afy_customer_status'] = 'Active';
    }
    await this.updateContactById(data.id, { properties });
    return properties;
  }

  async updateContactById(
    id: string,
    requestProperties: hubspot.contactsModels.SimplePublicObjectInput,
  ): Promise<hubspot.contactsModels.SimplePublicObject> {
    console.info({ id, requestProperties });
    const response = await this.hubspotClient.crm.contacts.basicApi.update(
      id,
      requestProperties,
    );
    return response.body;
  }

  async getContactById(id: string, properties: string[]) {
    const request = await this.hubspotClient.crm.contacts.basicApi.getById(
      id,
      properties,
    );
    return request.body;
  }

  async createTicket(
    createTicket: CreateTicketDto,
  ): Promise<CreateTicketResponseDto> {
    const { name: fullName, bookName, email, phone, content } = createTicket;
    const firstname = fullName.split(' ')[0];
    const contactData = await this.getContactId(email);
    let alreadyContactId;
    let contactObj;
    if (contactData != '404') {
      alreadyContactId = contactData;
    } else {
      // adding 1 in front of phone number to make it bypass clean phone method
      contactObj = await this.createContact(`1${phone}`, firstname, {
        email,
        lastname: fullName.split(' ').pop(),
      });
    }
    // Adding to workflow
    await this.addContactToWorkFlow({
      contactEmail: email,
      workFlowId: '11324',
    });
    // TO-DO - Temp solultion, we will try to generalize this
    let ticketId = '';
    const contactId = (alreadyContactId ||
      get(contactObj, ['body', 'id'], '')) as string;
    const properties: {
      hs_pipeline: string;
      hs_pipeline_stage: string;
      hubspot_owner_id: string;
      content: string;
      subject: string;
    } = {
      hs_pipeline: this.configService.get('strayDomainConstants.HS_PIPELINE'),
      hs_pipeline_stage: this.configService.get(
        'strayDomainConstants.HS_PIPELINE_STAGE',
      ),
      hubspot_owner_id: this.configService.get(
        'strayDomainConstants.HS_OWNER_ID',
      ),
      content: `Book Name: ${bookName}\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nContact Link: https://app.hubspot.com/contacts/3424767/contact/${contactId}/\nUrl: ${content}`,
      subject: `Generate ${bookName} for ${fullName}`,
    };

    const SimplePublicObjectInput = { properties };

    try {
      const ticketObj = await this.hubspotClient.crm.tickets.basicApi.create(
        SimplePublicObjectInput,
      );
      ticketId = ticketObj.body.id;
      await this.hubspotClient.crm.tickets.associationsApi.create(
        ticketId,
        'contact',
        contactId,
        'ticket_to_contact',
      );
    } catch (err) {
      if (err instanceof Error) {
        throw new HttpException(
          { message: err.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return { ticketId, contactId };
  }

  async getContactId(contactEmail: string): Promise<string> {
    try {
      const PublicObjectSearchRequest: hubspot.contactsModels.PublicObjectSearchRequest =
        {
          filterGroups: [
            {
              filters: [
                {
                  value: contactEmail,
                  propertyName: 'email',
                  operator: hubspot.contactsModels.Filter.OperatorEnum.Eq,
                },
              ],
            },
          ],
          sorts: ['firstname'],
          properties: ['firstname', 'lastname', 'id', 'email'],
          limit: 1,
          after: 0,
        };
      const result = await this.hubspotClient.crm.contacts.searchApi.doSearch(
        PublicObjectSearchRequest,
      );
      return get(first(get(result, ['body', 'results'])), ['id']);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getContactEmailIds(contactEmail: string): Promise<string> {
    try {
      const PublicObjectSearchRequest: hubspot.contactsModels.PublicObjectSearchRequest =
        {
          filterGroups: [
            {
              filters: [
                {
                  value: contactEmail,
                  propertyName: 'email',
                  operator: hubspot.contactsModels.Filter.OperatorEnum.Eq,
                },
              ],
            },
          ],
          sorts: ['firstname'],
          properties: ['firstname', 'lastname', 'id', 'email'],
          limit: 1,
          after: 0,
        };
      const result = await this.hubspotClient.crm.contacts.searchApi.doSearch(
        PublicObjectSearchRequest,
      );
      return get(first(get(result, ['body', 'results'])), [
        'properties',
        'email',
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async searchTicket(
    filters: Array<hubspot.ticketsModels.Filter>,
  ): Promise<hubspot.ticketsModels.CollectionResponseWithTotalSimplePublicObjectForwardPaging> {
    const filterGroups: Array<hubspot.ticketsModels.FilterGroup> = [
      { filters },
    ];
    const sorts = [
      JSON.stringify({
        propertyName: 'afy_order_number',
        direction: 'descending',
      }),
    ];
    const searchRequest: hubspot.ticketsModels.PublicObjectSearchRequest = {
      properties: [''],
      limit: 2,
      after: 0,
      filterGroups,
      sorts,
    };
    const hsDealResponse =
      await this.hubspotClient.crm.tickets.searchApi.doSearch(searchRequest);
    const hasResults = !!get(hsDealResponse, ['body']);
    if (!hasResults) {
      return null;
    }
    return hsDealResponse.body;
  }

  async updateTicket(
    ticketId: string,
    properties: hubspot.ticketsModels.SimplePublicObjectInput,
  ): Promise<hubspot.ticketsModels.SimplePublicObject> {
    const ticketData = await this.hubspotClient.crm.tickets.basicApi.update(
      ticketId,
      properties,
    );
    const hasResults = !!get(ticketData, ['body']);
    if (!hasResults) {
      return null;
    }
    return ticketData.body;
  }

  async addContactToWorkFlow({ contactEmail, workFlowId }): Promise<string> {
    try {
      const emails = [contactEmail];
      const url = `/contacts/v1/lists/${workFlowId}/add`;
      await this.customApiRequest<hubspot.contactsModels.SimplePublicObject>(
        'POST',
        url,
        {
          emails,
        },
      );
      return 'Successfully added';
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   *  This method make api request to hubspot and add contact to workflow
   *
   * @param - Contact Email, WorkFlow Id
   *
   * @see {@link https://legacydocs.hubspot.com/docs/methods/workflows/add_contact}
   *
   * @return Successfully added message
   */
  async addContactToWorkFlowId(data: AddContactToWorkFlowDto): Promise<string> {
    try {
      const url = `/automation/v2/workflows/${data.workFlowId}/enrollments/contacts/${data.contactEmail}`;
      await this.customApiRequest<void>('POST', url, {});
      return 'Successfully added';
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  getContactByPhoneNumber(phone: string) {
    let formattedNumber = HubspotService.cleanPhone(phone);
    if (!formattedNumber) {
      formattedNumber = phone;
    }
    const sort = JSON.stringify({
      propertyName: 'createdate',
      direction: 'DESCENDING',
    });
    const properties = [
      'createdate',
      'firstname',
      'lastname',
      'email',
      'phone',
    ];
    const limit = 1;
    const after = 0;
    const requestObject: hubspot.contactsModels.PublicObjectSearchRequest = {
      filterGroups: [],
      query: formattedNumber,
      sorts: [sort],
      properties,
      limit,
      after,
    };

    if (!requestObject.query) {
      return null;
    }
    return this.hubspotClient.crm.contacts.searchApi.doSearch(requestObject);
  }

  createContact(
    phone: string,
    firstname: string,
    contact = {},
  ): Promise<{
    response: http.IncomingMessage;
    body: SimplePublicObject;
  }> {
    let cleanedPhone = HubspotService.cleanPhone(phone);
    if (!cleanedPhone) {
      cleanedPhone = phone;
    }
    let properties = {
      phone: cleanedPhone || '',
      firstname: HubspotService.cleanName(firstname),
    };
    properties = { ...properties, ...contact };
    const input: hubspot.contactsModels.SimplePublicObjectInput = {
      properties,
    };
    return this.hubspotClient.crm.contacts.basicApi.create(input);
  }

  async createCallEngagement(
    contactId: string,
    downloadUrl: string,
    payload: RecordingCompletedPayloadObjectDto,
    ownerId: string,
  ) {
    try {
      const durationObj = millisecondsToHuman(payload.duration);
      const date = timeStampToHumanReadable(payload.date_time, TimeZones.EST);

      const hsCallBody = `
    <strong>date:</strong> ${date} <br>
    <strong>call type:</strong> ${payload.direction}<br>
    <strong>caller number:</strong> ${payload.caller_number}<br>
    <strong>callee number:</strong> ${payload.callee_number}<br>
    <strong>call duration:</strong> ${toTwoDigits(
      durationObj.hours,
    )}:${toTwoDigits(durationObj.minutes)}:${toTwoDigits(
        durationObj.seconds,
      )}<br>
    <strong>agent name:</strong> ${payload.owner.name}<br>
    `;

      const body = {
        properties: {
          hs_timestamp: Date.parse(payload.date_time).toString(),
          hubspot_owner_id: ownerId,
          hs_call_duration: payload.duration.toString(),
          hs_call_from_number: payload.caller_number,
          hs_call_to_number: payload.callee_number,
          hs_call_recording_url: downloadUrl,
          hs_call_status: 'COMPLETED',
          hs_call_body: hsCallBody,
          hs_call_disposition: CallDisposition.CONNECTED,
        },
      };
      const call = await this.hubspotClient.crm.objects.basicApi.create(
        'calls',
        body,
      );
      const callId = call.body.id;
      await this.associateCallToContact(callId, contactId);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async getContactIdByTicketId(ticketId: string): Promise<string> {
    try {
      const url = `/crm/v3/objects/tickets/${ticketId}/?associations=contacts`;
      const response = await this.customApiRequest<ContactResponse>(
        'GET',
        url,
        {},
      );
      const contactId = <string>(
        get(response, ['associations', 'contacts', 'results', 0, 'id'])
      );
      return contactId;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            message:
              'Error while getting contactId while using getContactIdByTicketId',
            method: 'getContactIdByTicketId',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async associateCallToContact(
    callId: string,
    contactId: string,
  ): Promise<SimplePublicObjectWithAssociations> {
    try {
      const result =
        await this.hubspotClient.crm.objects.associationsApi.create(
          'calls',
          callId,
          'contact',
          contactId,
          '194',
        );
      return result.body;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async getOwnerByEmail(email: string): Promise<string> {
    if (!Boolean(email)) {
      return '';
    }
    const request = await this.hubspotClient.crm.owners.ownersApi.getPage(
      email,
    );
    return get(request, ['body', 'results', '0', 'id'], '') as string;
  }

  async updateContactByTicketId(
    ticketId: string,
    contactDetails: UpdateContactDto,
  ): Promise<string> {
    const apiResponse = await this.hubspotClient.crm.tickets.basicApi.getById(
      ticketId,
    );
    if (apiResponse.body.id) {
      const { hs_pipeline, hs_pipeline_stage } = apiResponse.body.properties;
      const hsPipeline = this.configService.get<string>(
        'strayDomainConstants.HS_PIPELINE',
      );
      const hsPipelineStage = this.configService.get<string>(
        'strayDomainConstants.HS_PIPELINE_STAGE',
      );
      if (hs_pipeline !== hsPipeline || hs_pipeline_stage !== hsPipelineStage) {
        throw new HttpException(
          { message: 'There are no open tickets with the provided id' },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        { message: 'No ticket found with the provided id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const associations =
      await this.hubspotClient.crm.tickets.associationsApi.getAll(
        ticketId,
        'contact',
      );
    const contactId =
      associations.body?.results?.find(
        ({ type }) => type === 'ticket_to_contact',
      )?.id || '';
    if (contactId) {
      const properties = {
        ...pick(contactDetails, ['address', 'state', 'city', 'zip', 'country']),
        text_message_opt_in: contactDetails.textMessageOptIn.toString(),
      };
      const SimplePublicObjectInput = { properties };
      try {
        await this.hubspotClient.crm.contacts.basicApi.update(
          contactId,
          SimplePublicObjectInput,
        );
        await this.addContactToWorkFlow({
          contactEmail: contactDetails.email,
          workFlowId: '11325',
        });
        return 'Successfully updated';
      } catch (err) {
        if (err instanceof Error) {
          throw new HttpException(
            { message: err.message },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } else {
      throw new HttpException(
        { message: 'No contacts found with associated ticket' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getContactDetailsByEmail(contactEmail: string): Promise<ContactV1> {
    try {
      const url = `/contacts/v1/contact/email/${contactEmail}/profile`;
      const response = await this.customApiRequest<ContactV1>('GET', url, {});
      return response;
    } catch (err) {
      if (err instanceof Error && 'status' in err && err.status === 404) {
        throw new HttpException(
          { message: 'Member not found' },
          HttpStatus.NOT_FOUND,
        );
      } else if (err instanceof Error) {
        throw new HttpException(
          { message: err.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async spendDentistCredits(
    contactEmail: string,
    amount: number,
  ): Promise<void> {
    const currentCredits = await this.getContactDentistCredits(contactEmail);

    if (currentCredits < amount) {
      throw new HttpException(
        { message: 'Not enough credits' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCredits = currentCredits - amount;
    const contactId = await this.getContactId(contactEmail);
    const properties = {
      dentist_guide_credits: newCredits.toString(),
    };
    await this.updateContactById(contactId, { properties });
  }

  async getContactCredits(contactEmail: string): Promise<number> {
    const contactDetail = await this.getContactDetailsByEmail(contactEmail);
    const data = get(
      contactDetail,
      ['properties', 'afy_book_credits', 'value'],
      0,
    );
    return +data;
  }

  async getContactDentistCredits(contactEmail: string): Promise<number> {
    const contactDetail = await this.getContactDetailsByEmail(contactEmail);
    const data = get(
      contactDetail,
      ['properties', 'dentist_guide_credits', 'value'],
      0,
    );
    return +data;
  }

  async isAdminByEmail(email: string): Promise<boolean> {
    // TODO: adding ts-ignore because this error is due to hubspot library been outdated
    // @ts-ignore
    const data = (await this.getContactDetailsByEmail(email)) as {
      properties: { afy_admin: { value: string } };
    };
    const isAdmin = data?.properties?.afy_admin?.value === 'Yes';

    return isAdmin;
  }

  async isSuperAdminByEmail(email: string): Promise<boolean> {
    // TODO: adding ts-ignore because this error is due to hubspot library been outdated
    // @ts-ignore
    const data = (await this.getContactDetailsByEmail(email)) as {
      properties: { afy_super_admin: { value: string } };
    };
    const isSuperAdmin = data?.properties?.afy_super_admin?.value === 'Yes';

    return isSuperAdmin;
  }

  public async updateAfyPassword(dto: UpdateAfyPasswordDto): Promise<string> {
    this.logger.log(
      {
        payload: {
          method: 'HubspotService@updateAfyPassword',
          message: 'checking dto values',
          params: dto,
          usageDate: DateTime.now(),
        },
      },
      CONTEXT_HUBSPOT_PASSWORD,
    );
    const hubspotDto = {
      afy_password: dto.password,
      afy_password_encrypted: dto.encryptedPassword,
    };

    this.logger.log(
      {
        payload: {
          method: 'HubspotService@updateAfyPassword',
          message: 'checking hubspotDto values',
          params: hubspotDto,
          usageDate: DateTime.now(),
        },
      },
      CONTEXT_HUBSPOT_PASSWORD,
    );

    try {
      const contact = await this.hubspotClient.crm.contacts.basicApi.update(
        dto.email,
        { properties: { ...hubspotDto } },
        'email',
      );

      this.logger.log(
        {
          payload: {
            method: 'HubspotService@updateAfyPassword',
            message: 'checking update contact response',
            params: contact,
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_HUBSPOT_PASSWORD,
      );

      return contact.body.id;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getAllBlogPosts(): Promise<Array<BlogPost>> {
    try {
      const blogs = (
        await this.hubspotClient.cms.blogs.blogPosts.blogPostApi.getPage()
      )?.body?.results;
      return blogs;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getActiveMemberListDeal(
    customerEmail: string,
  ): Promise<
    HSDataObject<Partial<DealProperties>> | SimplePublicObject | null
  > {
    console.log('customerEmai:', customerEmail);
    const filters: Array<hubspot.dealsModels.Filter> = [
      {
        propertyName: 'chargify_subscription_id',
        operator: hubspot.dealsModels.Filter.OperatorEnum.HasProperty,
      },
      {
        propertyName: 'contact_email',
        operator: hubspot.dealsModels.Filter.OperatorEnum.Eq,
        value: customerEmail,
      },
    ];
    const filterGroups: Array<hubspot.dealsModels.FilterGroup> = [{ filters }];
    const sorts = [
      JSON.stringify({
        propertyName: 'chargify_subscription_id',
        direction: 'descending',
      }),
    ];

    const searchRequest: hubspot.dealsModels.PublicObjectSearchRequest = {
      properties: [
        'dealstage',
        'chargify_subscription_id',
        'dealname',
        'hubspot_owner_id',
      ],
      limit: 5,
      after: 0,
      filterGroups,
      sorts,
    };
    const hsDealResponse =
      await this.hubspotClient.crm.deals.searchApi.doSearch(searchRequest);
    const total = get(hsDealResponse, ['body', 'total']);
    const hasResults = !!total;

    if (!hasResults) {
      return null;
    }

    let dealResult = get(hsDealResponse, [
      'body',
      'results',
      '0',
    ]) as SimplePublicObject;

    if (total > 1) {
      const results = hsDealResponse?.body?.results;
      const deal = results.find(
        (result) => result?.properties?.dealstage === DEAL_DEAL_STAGE_ID,
      );
      if (deal) {
        dealResult = deal;
      }
    }

    const dealOwnerId = dealResult?.properties?.hubspot_owner_id;
    let dealOwnerDetails: PublicOwner = null;
    if (dealOwnerId) {
      dealOwnerDetails = await this.getOwnerInfo(+dealOwnerId);
    }

    if (dealOwnerDetails) {
      return {
        ...dealResult,
        //@ts-ignore
        dealOwnerDetails: dealOwnerDetails,
      };
    }
    return dealResult;
  }

  async getDealBySubscriptionId(
    subscriptionId: number,
  ): Promise<
    HSDataObject<Partial<DealProperties>> | SimplePublicObject | null
  > {
    const filters: Array<hubspot.dealsModels.Filter> = [
      {
        propertyName: 'chargify_subscription_id',
        operator: hubspot.dealsModels.Filter.OperatorEnum.Eq,
        value: subscriptionId.toString(10),
      },
    ];
    const filterGroups: Array<hubspot.dealsModels.FilterGroup> = [{ filters }];
    const sorts = [
      JSON.stringify({
        propertyName: 'chargify_subscription_id',
        direction: 'descending',
      }),
    ];

    const searchRequest: hubspot.dealsModels.PublicObjectSearchRequest = {
      properties: [
        'amount',
        'status',
        'dealstage',
        'chargify_subscription_id',
        'hs_object_id',
        'authorify_product',
      ],
      limit: 5,
      after: 0,
      filterGroups,
      sorts,
    };
    const hsDealResponse =
      await this.hubspotClient.crm.deals.searchApi.doSearch(searchRequest);

    const total = get(hsDealResponse, ['body', 'total']);
    const hasResults = !!total;

    if (!hasResults) {
      return null;
    }

    if (total > 1) {
      const results = hsDealResponse?.body?.results;
      const deal = results.find(
        (result) => result?.properties?.dealstage === DEAL_DEAL_STAGE_ID,
      );
      if (deal) {
        return deal;
      }
    }

    return get(hsDealResponse, ['body', 'results', '0']) as SimplePublicObject;
  }

  async createSubscriptionDeal(
    subscription: Subscription,
    customer: Customer,
    product: ProductDocument,
    // Chargify string date
    lastPaymentDate?: string,
    funnelSource?: string,
  ): Promise<hubspot.dealsModels.SimplePublicObject> {
    lastPaymentDate = !lastPaymentDate
      ? DateTime.now().toFormat('yyyy-LL-dd')
      : convertToHSDate(lastPaymentDate);

    const objectInput: hubspot.dealsModels.SimplePublicObjectInput = {
      properties: {
        [product.productProperty ?? HubspotProductProperty.AUTHORIFY_PRODUCT]:
          product.title,
        [product.priceProperty ??
        HubspotPriceProperty.RECURRING_REVENUE_AMOUNT]:
          product.value?.toString(10),
        dealname: this.createDealName(subscription, customer, product),
        funnel_source: funnelSource,
        pipeline: DEAL_PIPELINE_ID,
        dealstage: DEAL_DEAL_STAGE_ID,
        status: this.translateStripeStatusToHubspot(subscription.state),
        amount: product.value?.toString(10),
        chargify_subscription_id: subscription.id.toString(10),
        contact_email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        next_recurring_date: subscription.current_period_ends_at
          ? convertToHSDate(subscription.current_period_ends_at)
          : DateTime.now().plus({ months: 1 }).toFormat('yyyy-LL-dd'),
        last_payment_date: lastPaymentDate,
      },
    };
    /** LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email: customer.email,
          usageDate: DateTime.now(),
          method: 'createSubscriptionDeal',
          operation: 'creating hubspot deal',
          objectInput,
        },
      },
      CONTEXT_HUBSPOT,
    );

    const { body: createdDeal } =
      await this.hubspotClient.crm.deals.basicApi.create(objectInput);

    return createdDeal;
  }

  async updateLastPaymentDateWithNextRecurringDateDeal(
    dealId: string,
    lastPaymentDate: string, // HSDate
    nextRecurringDate: string,
  ): Promise<hubspot.dealsModels.SimplePublicObject | null> {
    const pipelineId = await this.getPipelineIdByDealId(dealId);
    if (pipelineId?.value === DEAL_PIPELINE_ID) {
      const objectInput: hubspot.dealsModels.SimplePublicObjectInput = {
        properties: {
          last_payment_date: lastPaymentDate,
          next_recurring_date: nextRecurringDate,
        },
      };
      this.logger.log({ updateDeal: objectInput }, CONTEXT_HUBSPOT);
      const { body: updatedDeal } =
        await this.hubspotClient.crm.deals.basicApi.update(dealId, objectInput);

      return updatedDeal;
    }
  }

  async updateNewComponentDeal(
    dealId: string,
    subscription: Subscription,
    product: ProductDocument,
    lastPaymentDate: string, // HSDate
  ): Promise<hubspot.dealsModels.SimplePublicObject> {
    lastPaymentDate = !lastPaymentDate
      ? DateTime.now().toFormat('yyyy-LL-dd')
      : convertToHSDate(lastPaymentDate);
    const objectInput: hubspot.dealsModels.SimplePublicObjectInput = {
      properties: {
        last_payment_date: lastPaymentDate,
        [product.productProperty ?? HubspotProductProperty.AUTHORIFY_PRODUCT]:
          product.title,
        [product.priceProperty ??
        HubspotPriceProperty.RECURRING_REVENUE_AMOUNT]:
          product.value.toString(),
        dealname: this.createDealName(
          subscription,
          subscription.customer,
          product,
          subscription.name,
        ),
        next_recurring_date: subscription.current_period_ends_at
          ? convertToHSDate(subscription.current_period_ends_at)
          : DateTime.now().plus({ months: 1 }).toFormat('yyyy-LL-dd'),
        status: this.translateStripeStatusToHubspot(subscription.state),
        amount: product.value.toString(),
      },
    };
    console.info({ objectInput });

    const pipelineId = await this.getPipelineIdByDealId(dealId);
    if (pipelineId?.value === DEAL_PIPELINE_ID) {
      const { body: updatedDeal } =
        await this.hubspotClient.crm.deals.basicApi.update(dealId, objectInput);

      return updatedDeal;
    }
  }

  public async associateDealToContact(
    contactId: string,
    dealId: string,
  ): Promise<hubspot.dealsModels.SimplePublicObjectWithAssociations> {
    console.info({ contactId, dealId });

    const { body: association } =
      await this.hubspotClient.crm.deals.associationsApi.create(
        dealId,
        'contact',
        contactId,
        'deal_to_contact',
      );

    console.info({ association });
    return association;
  }

  public async getDealsAssociation(
    dealId: string,
  ): Promise<hubspot.dealsModels.CollectionResponseAssociatedIdForwardPaging> {
    const responseData =
      await this.hubspotClient.crm.deals.associationsApi.getAll(dealId, 'deal');
    return responseData.body;
  }

  public async deleteAssociation(dealId: string, association: string) {
    try {
      await this.hubspotClient.crm.deals.associationsApi.archive(
        dealId,
        'deal',
        association,
        'deal_to_contact',
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async createLineItem(
    lineItemDeo: LineItemDto,
  ): Promise<hubspot.lineItemsModels.SimplePublicObject> {
    const input: hubspot.lineItemsModels.SimplePublicObjectInput = {
      properties: { ...lineItemDeo },
    };

    const { body: createdLineItem } =
      await this.hubspotClient.crm.lineItems.basicApi.create(input);

    return createdLineItem;
  }

  public async associateLineItemToDeal(
    lineItemId: string,
    dealId: string,
  ): Promise<hubspot.lineItemsModels.SimplePublicObjectWithAssociations | null> {
    console.info({ lineItemId, dealId });
    const pipelineId = await this.getPipelineIdByDealId(dealId);
    if (pipelineId?.value === DEAL_PIPELINE_ID) {
      const { body: association } =
        await this.hubspotClient.crm.lineItems.associationsApi.create(
          lineItemId,
          'deal',
          dealId,
          'line_item_to_deal',
        );
      console.info({ association });
      return association;
    }
  }

  public async findProductByName(
    name: string,
  ): Promise<hubspot.productsModels.SimplePublicObject | null> {
    const filters: Array<hubspot.dealsModels.Filter> = [
      {
        propertyName: 'name',
        value: name,

        operator: hubspot.dealsModels.Filter.OperatorEnum.Eq,
      },
    ];

    const sort = JSON.stringify({
      propertyName: 'name',
      direction: 'ASCENDING',
    });

    const filterGroups: Array<hubspot.productsModels.FilterGroup> = [
      { filters },
    ];

    const requestSearch: hubspot.dealsModels.PublicObjectSearchRequest = {
      filterGroups,
      after: 0,
      limit: 1,
      properties: ['amount'],
      sorts: [sort],
    };

    const hubspotProductsResponse =
      await this.hubspotClient.crm.products.searchApi.doSearch(requestSearch);

    const hasResults = !!get(hubspotProductsResponse, ['body', 'total']);
    if (!hasResults) {
      return null;
    }

    return get(hubspotProductsResponse, [
      'body',
      'results',
      '0',
    ]) as SimplePublicObject;
  }

  public async createProduct(product: {
    title: string;
    value: number;
    chargifyId?: string;
  }): Promise<hubspot.productsModels.SimplePublicObject | null> {
    try {
      if (!product) {
        return null;
      }
      const productBody = {
        properties: {
          name: product.title,
          price: product.value.toString(),
          ...(product.chargifyId && { chargifyId: product.chargifyId }),
        },
      };

      const newProduct = await this.hubspotClient.crm.products.basicApi.create(
        productBody,
      );
      return newProduct.body;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async findProductByChargifyId(
    chargifyId: string,
  ): Promise<hubspot.productsModels.SimplePublicObject | null> {
    const filters: Array<hubspot.dealsModels.Filter> = [
      {
        propertyName: 'chargifyid',
        value: chargifyId,
        operator: hubspot.dealsModels.Filter.OperatorEnum.Eq,
      },
    ];

    const sort = JSON.stringify({
      propertyName: 'chargifyid',
      direction: 'ASCENDING',
    });

    const filterGroups: Array<hubspot.productsModels.FilterGroup> = [
      { filters },
    ];

    const requestSearch: hubspot.dealsModels.PublicObjectSearchRequest = {
      filterGroups,
      after: 0,
      limit: 1,
      properties: ['amount'],
      sorts: [sort],
    };

    const hubspotProductsResponse =
      await this.hubspotClient.crm.products.searchApi.doSearch(requestSearch);

    const hasResults = !!get(hubspotProductsResponse, ['body', 'total']);
    if (!hasResults) {
      return null;
    }

    return get(hubspotProductsResponse, [
      'body',
      'results',
      '0',
    ]) as SimplePublicObject;
  }

  async createOrUpdateProduct(
    productId: string,
    productDto: {
      title: string;
      value: number;
    },
  ) {
    const hubspotProductNew = await this.findProductByChargifyId(productId);

    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          method: 'createOrUpdateProduct',
          productId,
          hubspotProductNew,
        },
      },
      CONTEXT_HUBSPOT,
    );

    if (!hubspotProductNew) {
      return this.createProduct(productDto);
    }
    return hubspotProductNew;
  }

  async createGuideOrderTicket(
    createGuideDto: CreateGuideOrderDto,
    orderId: string,
    customerEmail: string,
  ): Promise<CreateRmPrintTicketResponseDto> {
    const {
      practiceEmail: email,
      frontCover,
      practiceAddress: address,
      practicePhone: phone,
      practiceLogo: logo,
      practiceWebsite: website,
      guideName,
      quantity,
      shippingAddress,
    } = createGuideDto;
    const contactData = await this.getContactDetailsByEmail(customerEmail);
    const firstname = get(
      contactData,
      ['properties', 'firstname', 'value'],
      '',
    );
    const lastname = get(contactData, ['properties', 'lastname', 'value'], '');
    const fullname = `${firstname} ${lastname}`;
    const setupTicketOwner = get(
      contactData,
      ['properties', 'setup_ticket_owner', 'value'],
      '',
    );

    const contactIdDefault = get(
      contactData,
      ['canonical-vid'],
      null,
    ) as string;

    let alreadyContactId: string;
    let contactObj: {
      body: SimplePublicObject;
    };
    if (contactIdDefault != '404') {
      alreadyContactId = contactIdDefault;
    } else {
      contactObj = await this.createContact(`1${phone}`, firstname, {
        email,
        lastname,
      });
    }

    await this.addContactToWorkFlow({
      contactEmail: email,
      workFlowId: WORKFLOW_ID,
    });
    let ticketId = '';
    const contactObjectId = contactObj?.body?.id;
    const contactId = alreadyContactId || contactObjectId;

    const subject = `${orderId} - Guide Setup - ${fullname}`;
    const completeAddress = `${address.addressLine1}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`;
    const properties: {
      [key: string]: string;
    } = {
      hs_pipeline: this.configService.get(
        'sendToPrintConstants.HS_DENTIST_GUIDE_PIPELINE',
      ),
      hs_pipeline_stage: this.configService.get(
        'sendToPrintConstants.HS_DENTIST_GUIDE_PIPELINE_STAGE',
      ),
      hubspot_owner_id: setupTicketOwner,
      content: `Name: ${fullname}\nEmail: ${email}\nPhone: ${phone}\nContact Link: https://app.hubspot.com/contacts/3424767/contact/${contactId}/\nUse "Guides Link" for flipper links\nUse "AFY Marketing Materials" for infographics`,
      subject,
      days_pending: '2',
      first_name: firstname,
      hs_ticket_priority: 'HIGH',
      address: completeAddress,
      logo,
      website,
      afy_book_quantity: quantity.toString(),
      afy_shipping_address1: shippingAddress.addressLine1,
      afy_shipping_city: shippingAddress.city,
      afy_shipping_country: shippingAddress.country,
      afy_shipping_state: shippingAddress.state,
      afy_shipping_zip: shippingAddress.pincode,
      guide_name: guideName,
    };

    frontCover.forEach((data, index) => {
      properties[`n${index + 1}__headshot`] = data.image;
      properties[`n${index + 1}__name`] = data.name;
      properties[`n${index + 1}__title`] = data.title;
    });

    try {
      const ticketObj = await this.hubspotClient.crm.tickets.basicApi.create({
        properties,
      });
      ticketId = ticketObj.body.id;
      await this.hubspotClient.crm.tickets.associationsApi.create(
        ticketId,
        'contact',
        contactId,
        'ticket_to_contact',
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return { ticketId, contactId };
  }

  async createPrintQueueTicket(
    createTicketDto: CreateRmPrintTicketDto,
  ): Promise<CreateRmPrintTicketResponseDto> {
    const {
      email,
      coverUrl,
      magazineMonth,
      additionalInformation,
      rmProofLink,
      rmMemberSiteLink,
      rmShippedMagazineLink,
      adminFullName,
    } = createTicketDto;
    const contactData = await this.getContactDetailsByEmail(email);
    const firstname = get(
      contactData,
      ['properties', 'firstname', 'value'],
      '',
    );
    const parsedMonth =
      <string>MonthsLong[`${magazineMonth?.toLowerCase()}`] ?? '';
    const lastname = get(contactData, ['properties', 'lastname', 'value'], '');
    const fullname = `${firstname} ${lastname}`;
    const phone = get(contactData, ['properties', 'phone', 'value'], '');
    const setupTicketOwner = get(
      contactData,
      ['properties', 'setup_ticket_owner', 'value'],
      '',
    );

    const contactIdDefault = get(
      contactData,
      ['canonical-vid'],
      null,
    ) as string;

    let alreadyContactId: string;
    let contactObj: {
      body: SimplePublicObject;
    };
    if (contactIdDefault != '404') {
      alreadyContactId = contactIdDefault;
    } else {
      // adding 1 in front of phone number to make it bypass clean phone method
      contactObj = await this.createContact(`1${phone}`, firstname, {
        email,
        lastname,
      });
    }

    // Adding to workflow
    const workFlowId = '11324';
    await this.addContactToWorkFlow({
      contactEmail: email,
      workFlowId,
    });
    let ticketId = '';
    const contactObjectId = contactObj?.body?.id;
    const contactId = alreadyContactId || contactObjectId;

    const prefix = adminFullName ? `ADMIN[${adminFullName}] - ` : 'DMP - ';
    const subject = `${prefix}${get(
      contactData,
      ['properties', 'rm_hub_guid', 'value'],
      '',
    )} ${upperFirst(parsedMonth)} RM Setup - ${fullname}`;

    const properties: {
      [key: string]: string;
    } = {
      hs_pipeline: this.configService.get('sendToPrintConstants.HS_PIPELINE'),
      hs_pipeline_stage: this.configService.get(
        'sendToPrintConstants.HS_PIPELINE_STAGE',
      ),
      hubspot_owner_id: setupTicketOwner,
      content: `Name: ${fullname}\nEmail: ${email}\nPhone: ${phone}\nContact Link: https://app.hubspot.com/contacts/3424767/contact/${contactId}/\nUrl: ${coverUrl}`,
      subject,
      days_pending: '2',
      first_name: firstname,
      hs_ticket_priority: 'HIGH',
      special_instructions: additionalInformation,
      rm_proof_link: rmProofLink,
      rm_member_site_link_cloned_: rmMemberSiteLink,
      rm_shipped_magazine_link: rmShippedMagazineLink,
    };

    try {
      const ticketObj = await this.hubspotClient.crm.tickets.basicApi.create({
        properties,
      });
      ticketId = ticketObj.body.id;
      await this.hubspotClient.crm.tickets.associationsApi.create(
        ticketId,
        'contact',
        contactId,
        'ticket_to_contact',
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return { ticketId, contactId };
  }

  createDealName(
    subscription: Subscription,
    customer: Customer,
    product: ProductDocument,
    customerSubscriptionName = 'John Doe',
  ): string {
    const customerName =
      get(customer, ['first_name']) + ' ' + get(customer, ['last_name']) ||
      customerSubscriptionName;
    const status = get(subscription, ['state']);

    const trialing = status === 'trialing' ? ' - trialing' : '';

    return `${customerName} - ${product.title}${trialing}`;
  }

  translateStripeStatusToHubspot(status: State): string {
    const failed = [
      'canceled',
      'expired',
      'failed_to_create',
      'on_hold',
      'suspended',
      'trial_ended',
      'past_due',
      'unpaid',
      'soft_failure',
    ];
    const internalChargify = ['assessing', 'pending'];
    if (internalChargify.includes(status)) {
      return 'Trialing';
    }
    if (failed.includes(status)) {
      return 'Failed';
    }
    return capitalizeFirstLetter(status);
  }

  cleanProperties(
    propertyObject: hubspot.dealsModels.SimplePublicObjectInput,
  ): hubspot.dealsModels.SimplePublicObjectInput {
    const cleanProperties = {};
    for (const property in propertyObject.properties) {
      if (property !== undefined) {
        cleanProperties[property] = propertyObject.properties[property];
      }
    }
    return {
      properties: {
        ...cleanProperties,
      },
    };
  }

  public async updateDeal(
    dealId: string,
    propertyObject: hubspot.dealsModels.SimplePublicObjectInput,
  ): Promise<hubspot.dealsModels.SimplePublicObject> {
    try {
      const cleanPropertyObject = this.cleanProperties(propertyObject);
      const pipelineId = await this.getPipelineIdByDealId(dealId);
      if (pipelineId?.value === DEAL_PIPELINE_ID) {
        const { body: updatedDeal } =
          await this.hubspotClient.crm.deals.basicApi.update(
            dealId,
            cleanPropertyObject,
          );

        this.logger.log(
          {
            payload: <LoggerPayload>{
              method: 'updateDeal',
              message: 'Success Update Deal',
              usageDate: DateTime.now(),
              updatedDeal,
              dealId,
              cleanPropertyObject,
            },
          },
          CONTEXT_CHARGIFY_DEAL,
        );

        return updatedDeal;
      }
    } catch (err) {
      if (err instanceof Error) {
        const cleanPropertyObject = this.cleanProperties(propertyObject);
        this.logger.log(
          {
            payload: <LoggerPayload>{
              method: 'updateDeal',
              message: 'Error Update Deal',
              usageDate: DateTime.now(),
              error: err.message,
              stack: err?.stack,
              dealId,
              cleanPropertyObject,
            },
          },
          CONTEXT_CHARGIFY_DEAL,
        );

        throw new HttpException(
          { message: err.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async findActiveDealsByEmail(
    email: string,
  ): Promise<hubspot.dealsModels.CollectionResponseWithTotalSimplePublicObjectForwardPaging> {
    try {
      const body = {
        filterGroups: [
          {
            filters: [
              {
                value: email,
                propertyName: 'contact_email',
                operator: 'EQ',
              },
              {
                value: 'Active',
                propertyName: 'status',
                operator: 'EQ',
              },
              {
                propertyName: 'next_recurring_date',
                operator: 'HAS_PROPERTY',
              },
            ],
          },
          {
            filters: [
              {
                value: email,
                propertyName: 'contact_email',
                operator: 'EQ',
              },
              {
                value: 'Trialing',
                propertyName: 'status',
                operator: 'EQ',
              },
              {
                propertyName: 'next_recurring_date',
                operator: 'HAS_PROPERTY',
              },
            ],
          },
        ],
        properties: [
          'amount',
          'next_recurring_Date',
          'status',
          'chargify_subscription_id',
          'stripe_subscription_id',
        ],
        limit: 100,
        after: 0,
      };
      const url = `/crm/v3/objects/deals/search`;

      const response =
        await this.customApiRequest<hubspot.dealsModels.CollectionResponseWithTotalSimplePublicObjectForwardPaging>(
          'POST',
          url,
          body,
        );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async customApiRequest<T>(
    method: string,
    URL: string,
    body: Record<string, any>,
  ): Promise<T> {
    try {
      const options = {
        method: method,
        path: URL,
        body: body,
      };
      const result = await this.hubspotClient.apiRequest(options);
      return result.body as T;
    } catch (err) {
      if (
        err instanceof Error &&
        'statusCode' in err &&
        err.statusCode === 404
      ) {
        throw new HttpException(
          { message: 'Resource not found' },
          HttpStatus.NOT_FOUND,
        );
      } else if (err instanceof Error) {
        throw new HttpException(
          { message: err.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Get contacts by using list id
   *
   * @param data - with List Id, Workflow Id
   *
   * @param urlData - with Count, vid-offset
   *
   * @return list of contacts
   */
  async getListContactDetails(
    data: ContactToWorkFlowDto,
    urlData: HsUrlDataDto,
    method: string,
  ): Promise<ListOfContacts> {
    try {
      const url = `/contacts/v1/lists/${data.listId}/contacts/all?count=${urlData.contactCount}&vidOffset=${urlData.vidOffset}`;
      const response = await this.customApiRequest<ListOfContacts>(
        method,
        url,
        {},
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Configure contacts with workflow
   *
   * @param data - with List Id, Workflow Id
   *
   * @returns Will get message, errors count.
   */
  async getListContactsWithWorkflow(
    data: ContactToWorkFlowDto,
  ): Promise<MessageErrorObj> {
    const urlData = { contactCount: 10, vidOffset: 1 };
    let hasMore = true;
    const errors = [];
    while (hasMore) {
      await sleep(1000);
      const response = await this.getListContactDetails(data, urlData, 'GET');
      hasMore = response['has-more'];
      urlData.vidOffset = response['vid-offset'];
      await Promise.all(
        response.contacts.map(async (dataDetails) => {
          try {
            const strVid = dataDetails.vid.toString();
            const identitiesProfiles = get(dataDetails, ['identity-profiles']);
            const { identities } = identitiesProfiles.find(
              (ip) => ip.vid.toString() === strVid,
            );
            const contactEmail = identities.find(
              (i) => i.type === 'EMAIL' && i['is-primary'],
            );
            const resData = {
              contactEmail: contactEmail?.value,
              workFlowId: data.workFlowId,
            };
            return this.addContactToWorkFlowId(resData);
          } catch (err) {
            errors.push(err);
          }
        }),
      );
    }
    return {
      message: `All Contacts are successfully tagged with WorkflowId ${data.workFlowId}`,
      errors: errors.length,
    };
  }

  async getHubspotProperties(
    objectType = HubspotObjectTypes.CONTACT,
    archived = false,
  ): Promise<Property[]> {
    const url = `/crm/v3/properties/${objectType}?archived=${archived}`;
    try {
      const response: { results: Property[] } = await this.customApiRequest(
        'get',
        url,
        {},
      );
      return response.results;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            error: error.message,
            message: 'Could not fetch hubspot properties.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async verifyProduct(body: VerifyProductDto) {
    const {
      productName,
      propertyKey = 'name',
      propertyValue = 'Authorify Products',
    } = body;
    const properties = await this.getHubspotProperties(HubspotObjectTypes.DEAL);
    let verified = false;
    const authorifyProducts = properties.find(
      (property) => property[propertyKey] === propertyValue,
    );
    if (authorifyProducts) {
      const matchedProduct = authorifyProducts.options.find(
        (product) => product.value == productName,
      );
      verified = matchedProduct?.value && !matchedProduct?.hidden;
    }

    const productVerification: ProductVerificationStatus = {
      success: verified,
      message: VERIFICATION_STATUS[`${verified}`],
    };

    return productVerification;
  }

  async enrollContactsToList(
    listId: number,
    emails: Array<string>,
  ): Promise<AddToListResponseV1> {
    const url = `/contacts/v1/lists/${listId}/add`;
    return this.customApiRequest<AddToListResponseV1>('POST', url, { emails });
  }

  async getPipelineIdByDealId(dealId: string): Promise<Pipeline> {
    const url = `/deals/v1/deal/${dealId}`;
    try {
      const response: {
        properties: string;
      } = await this.customApiRequest('get', url, {});
      const value = get(response, [
        'properties',
        'pipeline',
        'value',
      ]) as string;
      return { value };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            message: 'unable to get pipeline id',
            error: error?.message,
            stack: error?.stack,
            name: error?.name,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async submitHSForms(
    formSubmission: FormSubmissionDto,
  ): Promise<FormSubmissionObject> {
    const url = `/submissions/v3/integration/submit/${formSubmission.portalId}/${formSubmission.formId}`;
    const payload = {
      submittedAt: DateTime.now().toMillis(),
      fields: formSubmission.fields,
      context: formSubmission.context,
    };
    const { data }: { data: FormSubmissionObject } = await this.httpForms.post(
      url,
      payload,
    );
    return data;
  }

  async createLineItemAssociations(
    lineItems: { id: string }[],
  ): Promise<AssociationType[]> {
    const promise = lineItems.map(async (item) => {
      const lineItemDetails = await this.getLineItemById(item.id);
      const hsProductId = lineItemDetails?.properties?.hs_product_id;
      const allowedLineItemsId =
        this.configService.get<Array<string>>('allowedLineItemsId');
      if (allowedLineItemsId.includes(hsProductId)) {
        return {
          to: {
            id: item.id,
          },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 67,
            },
          ],
        };
      }
    });
    const result = await Promise.all(promise);
    return result.filter(Boolean);
  }

  async getExistingQuotation(hsObjectSource: string): Promise<string | null> {
    const PublicObjectSearchRequest: hubspot.quotesModels.PublicObjectSearchRequest =
      {
        filterGroups: [
          {
            filters: [
              {
                value: hsObjectSource,
                propertyName: 'hs_comments',
                operator: 0,
              },
              {
                value: 'ESIGN_PENDING',
                propertyName: 'hs_sign_status',
                operator: 0,
              },
            ],
          },
        ],
        sorts: ['hs_domain'],
        properties: ['hs_domain', 'hs_slug', 'hs_sign_status', 'hs_quote_link'],
        limit: 1,
        after: 0,
      };

    const result = await this.customApiRequest(
      'POST',
      '/crm/v3/objects/quotes/search',
      PublicObjectSearchRequest,
    );
    const total = get(result, ['total'], 0) as number;

    const hasResults = !!total;
    if (!hasResults) {
      return null;
    }
    return get(
      result,
      ['results', '0', 'properties', 'hs_quote_link'],
      null,
    ) as string;
  }

  async sendQuoteLink(quoteLink: string, email: string): Promise<void> {
    const jobData = {
      quoteLink,
      email,
    };
    const opts = { removeOnComplete: true, removeOnFail: true };
    await this.hubspotQuoteQueue.add(jobData, opts);
  }

  async getDealById(
    dealId: string,
  ): Promise<SimplePublicObjectWithAssociations | null> {
    const deal = await this.hubspotClient.crm.deals.basicApi.getById(
      dealId,
      [
        'contact_email',
        'authorify_product',
        'first_name',
        'last_name',
        'hubspot_owner_id',
      ],
      ['line_items'],
    );

    if (!deal) {
      this.logger.error(
        {
          payload: {
            method: 'createQuotation',
            message: 'deal not found',
            params: { dealId },
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_HUBSPOT_QUOTE,
      );
      throw new HttpException(
        {
          message: 'Deal not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return deal.body;
  }

  async getOwnerInfo(ownerId: number): Promise<PublicOwner> {
    const ownerInfo = await this.hubspotClient.crm.owners.ownersApi.getById(
      ownerId,
    );

    if (!ownerInfo) {
      this.logger.error(
        {
          payload: {
            method: 'createQuotation',
            message: 'ownerInfo not found',
            params: { ownerId },
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_HUBSPOT_QUOTE,
      );
      throw new HttpException(
        {
          message: 'Owner not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return ownerInfo.body;
  }

  async publishQuote(payload: QuotePayloadType, contactEmail: string) {
    try {
      const quotesUrl = `/crm/v3/objects/quotes`;
      const quoteResponse: SimplePublicObjectWithAssociations =
        await this.customApiRequest('POST', quotesUrl, payload);

      const publishUrl = `/crm/v3/objects/quote/${quoteResponse.id}`;
      await this.customApiRequest('PATCH', publishUrl, {
        properties: {
          hs_status: 'APPROVAL_NOT_NEEDED',
        },
      });
      const quoteLink = `https://${quoteResponse.properties.hs_domain}/${quoteResponse.properties.hs_slug}`;
      await this.sendQuoteLink(quoteLink, contactEmail);
      return {
        quoteLink,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          {
            payload: {
              method: 'createQuotation',
              message: 'Unable to create quotation',
              error: error.message,
              usageDate: DateTime.now(),
            },
          },
          CONTEXT_HUBSPOT_QUOTE,
        );
        throw new HttpException(
          { message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getLineItemById(
    lineItemId: string,
  ): Promise<SimplePublicObject | null> {
    const lineItem = await this.hubspotClient.crm.lineItems.basicApi.getById(
      lineItemId,
    );

    if (!lineItem) {
      this.logger.error(
        {
          payload: {
            method: 'createQuotation',
            message: 'lineItem not found',
            params: { lineItemId },
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_HUBSPOT_QUOTE,
      );
      return null;
    }

    return lineItem.body;
  }

  async createQuotation(dto: CreateQuotationDto): Promise<QuoteLink> {
    const deal: SimplePublicObjectWithAssociations = await this.getDealById(
      dto.dealId,
    );

    const lineItems = deal.associations['line items'].results;

    const {
      contact_email: contactEmail,
      authorify_product: authorifyProduct,
      first_name: firstName,
      last_name: lastName,
      hubspot_owner_id: dealOwnerId,
    } = deal.properties;

    const currentYear = DateTime.now().toFormat('yyyy');
    const expirationDate = DateTime.now()
      .plus({ days: 7 })
      .toFormat('yyyy-MM-dd');
    const title = `${firstName} ${lastName} - ${authorifyProduct} ${currentYear}`;
    const hsObjectSource = `${title} - ${contactEmail}`;

    const existingQuoteLink = await this.getExistingQuotation(hsObjectSource);
    if (existingQuoteLink) {
      await this.sendQuoteLink(existingQuoteLink, contactEmail);
      return {
        quoteLink: existingQuoteLink,
      };
    }

    const contactId = await this.getContactId(contactEmail);
    let ownerEmail = '';
    let ownerFirstName = '';
    let ownerLastName = '';

    if (dealOwnerId) {
      const ownerInfo = await this.getOwnerInfo(Number(dealOwnerId));
      ownerEmail = ownerInfo.email;
      ownerFirstName = ownerInfo.firstName;
      ownerLastName = ownerInfo.lastName;
    }

    const quotesConfig: {
      [key: string]: string;
    } = this.configService.get('quotes');

    const quoteTemplate = this.configService.get<string>('quoteTemplate');
    const lineItemsPayload = await this.createLineItemAssociations(lineItems);
    const payload: QuotePayloadType = {
      properties: {
        hs_title: title,
        hs_expiration_date: expirationDate,
        hs_status: 'DRAFT',
        hs_sender_firstname: ownerFirstName,
        hs_sender_lastname: ownerLastName,
        hs_sender_email: ownerEmail,
        hs_comments: hsObjectSource,
        ...quotesConfig,
      },
      associations: [
        {
          to: {
            id: contactId,
          },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 702,
            },
          ],
        },
        {
          to: {
            id: dto.dealId,
          },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 64,
            },
          ],
        },
        {
          to: {
            id: quoteTemplate,
          },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 286,
            },
          ],
        },
        ...lineItemsPayload,
      ],
    };

    return await this.publishQuote(payload, contactEmail);
  }

  public async getMergedPackages(
    customerEmail: string,
    newPackages: Array<string>,
  ): Promise<string> {
    const packagesSet = new Set(newPackages);
    try {
      const user = await this.getContactDetailsByEmail(customerEmail);
      const existingPackages = user.properties.afy_package.value.split(';');
      existingPackages.forEach((p) => packagesSet.add(p));
    } catch (e) {}
    return Array.from(packagesSet).join(';');
  }
}
