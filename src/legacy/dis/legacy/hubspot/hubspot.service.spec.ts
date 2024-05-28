import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { Logger } from '@nestjs/common';
import { Client as HubspotClient } from '@hubspot/api-client/lib/src/client';
import { ConfigService } from '@nestjs/config';
import { HubspotController } from '@/legacy/dis/legacy/hubspot/hubspot.controller';
import { QuoteLink } from '@/legacy/dis/legacy/hubspot/domain/types';
import { SimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/objects/api';
import * as http from 'http';
import { PublicOwner } from '@hubspot/api-client/lib/codegen/crm/owners/model/publicOwner';
import { CollectionResponseWithTotalSimplePublicObjectForwardPaging } from '@hubspot/api-client/lib/codegen/crm/companies/api';

describe('Hubspot Service', () => {
  let hubspotService: HubspotService;
  let hubspotController: HubspotController;
  let hubspotClient: HubspotClient;
  let configService: ConfigService;
  let logger: Logger;

  beforeAll(() => {
    logger = new Logger();
    hubspotClient = new HubspotClient();
    configService = new ConfigService();
    hubspotService = new HubspotService(
      configService,
      hubspotClient,
      null,
      null,
      logger,
      null,
    );
    hubspotController = new HubspotController(hubspotService, logger);
  });

  it('Should services be defined', () => {
    expect(hubspotService).toBeDefined();
  });

  it('Should hubspotService.createQuotation be called', async () => {
    const mockResult: Promise<QuoteLink> = Promise.resolve({
      quoteLink: 'https://www.hubspot.com/slug-test',
    });

    jest.spyOn(hubspotService, 'getContactId').mockImplementation(() => {
      return Promise.resolve('123');
    });

    jest
      .spyOn(hubspotClient.crm.deals.basicApi, 'getById')
      .mockImplementation(() => {
        return Promise.resolve({
          response: <http.IncomingMessage>{
            aborted: true,
          },
          body: <SimplePublicObjectWithAssociations>{
            id: '123',
            createdAt: new Date(),
            updatedAt: new Date(),
            properties: {
              test: '123',
            },
            associations: {
              'line items': {
                results: [],
                hasMore: false,
              },
            },
          },
        });
      });

    jest
      .spyOn(hubspotClient.crm.owners.ownersApi, 'getById')
      .mockImplementation(() => {
        return Promise.resolve({
          response: <http.IncomingMessage>{
            aborted: true,
          },
          body: <PublicOwner>{
            id: '123',
          },
        });
      });

    jest.spyOn(hubspotService, 'customApiRequest').mockImplementation(() => {
      return Promise.resolve(<
        {
          properties: {
            [key: string]: string;
          };
        }
      >{
        properties: {
          hs_domain: 'www.hubspot.com',
          hs_slug: 'slug-test',
        },
      });
    });

    const serviceFunctionSpy = jest
      .spyOn(hubspotService, 'createQuotation')
      .mockReturnValue(mockResult);

    const resultPromise = await hubspotController.createQuotation({
      dealId: '123',
    });

    expect(serviceFunctionSpy).toHaveBeenCalled();
    expect(resultPromise).toBe(await mockResult);
  });

  it('should return null if phone number is empty', () => {
    const phoneNumber = '';
    expect(hubspotService.getContactByPhoneNumber(phoneNumber)).toBeNull();
  });

  it('should search contacts by phone number', async () => {
    const phoneNumber = '1234567890';
    const mockSearchResult = {
      response: <http.IncomingMessage>{
        aborted: true,
      },
      body: <CollectionResponseWithTotalSimplePublicObjectForwardPaging>{
        results: [],
        total: 0,
      },
    };
    jest.spyOn(HubspotService, 'cleanPhone').mockReturnValueOnce(phoneNumber);
    jest
      .spyOn(hubspotClient.crm.contacts.searchApi, 'doSearch')
      .mockResolvedValueOnce(mockSearchResult);

    const result = await hubspotService.getContactByPhoneNumber(phoneNumber);

    expect(result).toBe(mockSearchResult);
    expect(HubspotService.cleanPhone).toHaveBeenCalledWith(phoneNumber);
    expect(hubspotClient.crm.contacts.searchApi.doSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        query: phoneNumber,
      }),
    );
  });
});
