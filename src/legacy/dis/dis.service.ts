import { CreateCustomerDto } from '@/customers/customers/dto/create-customer.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomerStatus } from '@/customers/customers/domain/types';
import { Webinar } from './domain/webinar';
import { Axios } from 'axios';
import { ConfigService } from '@nestjs/config';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { DateTime } from 'luxon';
import { CONTEXT_HUBSPOT_PASSWORD } from '@/internal/common/contexts';
import { isEmpty } from 'lodash';
import { Address } from '@/customers/customers/domain/address';

@Injectable()
export class DisService {
  constructor(
    @Inject('HTTP_DIS') private readonly http: Axios,
    private readonly configService: ConfigService,
    private readonly hubspotService: HubspotService,
    private readonly logger: Logger,
  ) {}

  public async getAutoLoginToken(id: string) {
    return this.hubspotService.findOrCreateAutoLoginToken(id);
  }

  public async authenticateCustomerThroughHubspot(
    email: string,
    password: string,
  ): Promise<boolean> {
    return this.hubspotService.authenticate(email, password);
  }

  public async syncDependencies(
    dto: CreateCustomerDto,
    loginToken?: string,
    passwordEncrypted?: string,
  ): Promise<{ hubspotId: string }> {
    const hubspotId = await this.syncHubspot(
      dto,
      loginToken,
      passwordEncrypted,
    );
    return {
      hubspotId,
    };
  }

  private fixCountry(country: string): string {
    if (country === 'Canada' || country === 'CA') {
      return 'CA';
    }
    return 'US';
  }

  private validateAddress(address: Address): boolean {
    return (
      !isEmpty(address.address1) &&
      !isEmpty(address.city) &&
      !isEmpty(address.state) &&
      !isEmpty(address.zip) &&
      !isEmpty(address.country)
    );
  }

  private async syncHubspot(
    dto: CreateCustomerDto,
    loginToken?: string,
    passwordEncrypted?: string,
  ): Promise<string> {
    const isBillingAddressValid = this.validateAddress(dto.billing);
    const hubspotDto = {
      email: dto.email,
      firstname: dto.firstName,
      lastname: dto.lastName,
      phone: dto.phone,
      ...(dto.password && { afy_password: dto.password }),
      ...(dto.password &&
        passwordEncrypted && { afy_password_encrypted: passwordEncrypted }),
      afy_customer_login_token: loginToken,
      ...(isBillingAddressValid && {
        address: [dto.billing.address1, dto.billing.address2]
          .filter((address) => address)
          .join(', '),
        city: dto.billing.city,
        state: dto.billing.state,
        zip: dto.billing.zip,
        country: this.fixCountry(dto.billing.country),
      }),
      ...(dto.accountType && {
        account_type: dto.accountType,
      }),
    };

    if (this.configService.get('hubspot.forceCustomerActive')) {
      hubspotDto['afy_customer_status'] = CustomerStatus.ACTIVE;
    }

    if (dto?.smsPreferences?.schedulingCoachReminders) {
      hubspotDto['text_message_opt_in'] = true;
      this.logger.log(
        {
          payload: {
            message: 'customer has smsPreferences',
            method: 'HubspotController@createOrUpdateContact',
            executedBy: { name: 'DIS_SERVICE' },
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_HUBSPOT_PASSWORD,
      );
    }

    this.logger.log(
      {
        payload: {
          step: 'start',
          message: 'before update',
          method: 'HubspotController@createOrUpdateContact',
          executedBy: { name: 'DIS_SERVICE' },
          usageDate: DateTime.now(),
        },
      },
      CONTEXT_HUBSPOT_PASSWORD,
    );

    const createOrUpdateContact =
      await this.hubspotService.createOrUpdateContact(hubspotDto);

    this.logger.log(
      {
        payload: {
          step: 'end',
          message: 'after update',
          method: 'HubspotController@createOrUpdateContact',
          executedBy: { name: 'DIS_SERVICE' },
          usageDate: DateTime.now(),
        },
      },
      CONTEXT_HUBSPOT_PASSWORD,
    );

    return createOrUpdateContact;
  }

  async getWebinarInfo(webinarCode: string): Promise<Webinar> {
    const endpoint = `/v1/webinars/${webinarCode}`;
    const response = await this.http.get(endpoint);
    const { data } = response;
    return data;
  }

  async webinarRegistration(
    webinarCode: string,
    start: string,
    name: string,
    email: string,
    smsNumber: string,
  ): Promise<void> {
    const endpoint = `/v1/webinars/${webinarCode}`;
    const payload = {
      start_time: start,
      name,
      email,
      sms_number: smsNumber,
    };
    await this.http.post(endpoint, payload);
  }

  async addCustomerToWorkFlow(
    contactEmail: any,
    workFlowId: any,
  ): Promise<void> {
    const workflowDto = {
      contactEmail,
      workFlowId,
    };
    await this.hubspotService.addContactToWorkFlow(workflowDto);
  }
}
