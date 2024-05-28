import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import { Orders, SEResponse } from './domain/types';
import { DateTime } from 'luxon';
import {
  formatQueryString,
  prepareApiSignature,
} from './helpers/shipping-easy.helper';
import {
  AFY_ORDER_NUMBER,
  SHIPPINGEASY_API_KEY,
  SHIPPINGEASY_PROVIDER_NAME,
  SHIPPINGEASY_SECRET_KEY,
} from './constants';
import { get } from 'lodash';
import * as hubspot from '@hubspot/api-client';
import { sleep } from '@/internal/utils/functions';
import { CustomerPropertiesService } from '@/customers/customer-properties/customer-properties.service';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { CustomersService } from '@/customers/customers/customers.service';

@Injectable()
export class ShippingEasyService {
  private readonly logger = new Logger(ShippingEasyService.name);

  constructor(
    @Inject(SHIPPINGEASY_PROVIDER_NAME) private readonly http: Axios,
    @Inject(SHIPPINGEASY_API_KEY)
    private readonly apiKey: string,
    @Inject(SHIPPINGEASY_SECRET_KEY)
    private readonly apiSecret: string,
    private readonly customerPropertiesService: CustomerPropertiesService,
    private readonly hubspotService: HubspotService,
    private readonly customersService: CustomersService,
  ) {}

  public async getOrders(
    orderStatus: string,
    page = 1,
    perPage = 200,
  ): Promise<SEResponse> {
    const timestamp = parseInt((Date.now() / 1000).toString());
    const queryParamObject = {
      last_updated_at: DateTime.now().toFormat('yyyy-MM-dd'),
      page: page,
      per_page: perPage,
      status: orderStatus,
    };
    const apiSignature: string = prepareApiSignature(
      'GET',
      '/api/orders',
      timestamp,
      queryParamObject,
      this.apiKey,
      this.apiSecret,
    );

    const url =
      `/orders?api_signature=${apiSignature}&api_timestamp=${timestamp}&api_key=${this.apiKey}&` +
      formatQueryString(queryParamObject);
    try {
      const response: AxiosResponse = await this.http.get<SEResponse>(url);
      return JSON.parse(response.data) as SEResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(
          {
            message: 'Error while retrieveing shippingEasy records',
            method: 'getOrders',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async handleShippingEasyScheduler() {
    const orders = await this.getShippingEasyOrder();

    const errors = [];
    for (const order of orders) {
      try {
        const afyOrderNo = get(
          order,
          ['recipients', 0, 'original_order', 'custom_1'],
          '',
        );
        const trackingNumber = get(order, ['shipments', 0, 'tracking_number']);
        if (afyOrderNo) {
          const PublicObjectSearchRequest = [
            {
              value: afyOrderNo,
              propertyName: AFY_ORDER_NUMBER,
              operator: hubspot.dealsModels.Filter.OperatorEnum.Eq,
            },
          ];
          const findTicket = await this.hubspotService.searchTicket(
            PublicObjectSearchRequest,
          );
          const ticketId = get(findTicket, ['results', 0, 'id']);
          const contact = await this.hubspotService.getContactIdByTicketId(
            ticketId,
          );
          const contactDetails = await this.hubspotService.getContactById(
            contact,
            ['email'],
          );
          if (ticketId) {
            const objectInput = {
              properties: {
                afy_order_tracking_number: trackingNumber,
              },
            };
            await this.hubspotService.updateTicket(ticketId, objectInput);
          }
          const customerEmail = get(contactDetails, ['properties', 'email']);
          const customerDetails = await this.customersService.findByEmail(
            customerEmail,
          );
          if (!customerDetails) {
            throw new Error(
              `could not find customer details from ${customerEmail} in Digital Service`,
            );
          }
          const createPropertyPayload = {
            customer: customerDetails?._id,
            customerEmail,
            module: 'shippingEasy',
            value: 'tracking_number',
            name: 'ShippingEasy get orders',
            metadata: {
              afy_order_tracking_number: trackingNumber,
              afy_order_no: afyOrderNo,
            },
          };
          await this.customerPropertiesService.create(
            createPropertyPayload,
            customerDetails,
          );
        }
        await sleep(2000);
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error);
        }
      }
    }
    if (errors.length) {
      this.logger.error(errors);
    }
  }
  private async getShippingEasyOrder(): Promise<Orders[]> {
    // Initial api call with default page value for getting how many more pages are there in the response
    let maxPages = 1;
    let currentPage = 1;
    const orders: Orders[] = [];
    do {
      const records = await this.getOrders('shipped', currentPage, 200);
      const metadata = get(records, ['meta']);
      maxPages = metadata.total_pages;
      orders.push(...records.orders);
      currentPage += 1;
    } while (currentPage < maxPages);
    return orders;
  }
}
