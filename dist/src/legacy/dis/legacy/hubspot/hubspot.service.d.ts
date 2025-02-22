import { Logger } from '@nestjs/common';
import * as hubspot from '@hubspot/api-client';
import { Client as HubspotClient } from '@hubspot/api-client';
import { ConfigService } from '@nestjs/config';
import { Customer, State, Subscription } from '@/payments/chargify/domain/types';
import { CreateTicketDto, CreateTicketResponseDto } from './dto/createTicket.dto';
import { ContactDto, UpdateAfyPasswordDto, UpdateProfileAvatarDto } from './dto/contact.dto';
import { RecordingCompletedPayloadObjectDto } from '@/legacy/dis/legacy/zoom/dto/recording-completed.dto';
import { UpdateCreditsAndPackagesDto } from './dto/updateCreditsAndPackages.dto';
import { BlogPost } from '@hubspot/api-client/lib/codegen/cms/blogs/blog_posts/api';
import { AddToListResponseV1, ContactV1, DealProperties, FormSubmissionObject, HSDataObject, HubspotObjectTypes, ListOfContacts, MessageErrorObj, Pipeline } from '@/legacy/dis/legacy/hubspot/domain/types';
import { LineItemDto } from '@/legacy/dis/legacy/hubspot/dto/line-item.dto';
import { CreateRmPrintTicketDto, CreateRmPrintTicketResponseDto } from './dto/createRmPrintTicket.dto';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { SimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/objects/api';
import { AddContactToWorkFlowDto, ContactToWorkFlowDto, HsUrlDataDto } from './dto/addContactToWorkFlow.dto';
import { Property } from '@hubspot/api-client/lib/codegen/crm/properties/api';
import { ProductVerificationStatus, VerifyProductDto } from './dto/products.dto';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/companies/api';
import { Axios } from 'axios';
import { FormSubmissionDto } from '@/legacy/dis/legacy/hubspot/dto/form-submission.dto';
import { CreateGuideOrderDto } from '@/guides/orders/dto/create-guide-order.dto';
export declare class HubspotService {
    private readonly configService;
    private readonly hubspotClient;
    private readonly appEnv;
    private readonly httpForms;
    private readonly logger;
    constructor(configService: ConfigService, hubspotClient: HubspotClient, appEnv: string, httpForms: Axios, logger: Logger);
    static cleanName(name: string): string;
    static cleanPhone(phone: string): string;
    findOrCreateAutoLoginToken(id: string): Promise<string | false>;
    authenticate(email: string, password: string): Promise<boolean>;
    setContactOwnerIfNull(contactId: string, ownerId: string): Promise<void>;
    createOrUpdateContact(dto: ContactDto): Promise<string>;
    updateProfileAvatar(dto: UpdateProfileAvatarDto): Promise<string>;
    getContactOwnerId(contactId: string): Promise<string | null>;
    updateRmUserProperties({ email }: {
        email: string;
    }): Promise<hubspot.contactsModels.SimplePublicObject>;
    updateCreditsAndPackages(data: UpdateCreditsAndPackagesDto): Promise<{
        [x: string]: string;
    }>;
    updateContactById(id: string, requestProperties: hubspot.contactsModels.SimplePublicObjectInput): Promise<hubspot.contactsModels.SimplePublicObject>;
    getContactById(id: string, properties: string[]): Promise<hubspot.contactsModels.SimplePublicObjectWithAssociations>;
    createTicket(createTicket: CreateTicketDto): Promise<CreateTicketResponseDto>;
    getContactId(contactEmail: string): Promise<string>;
    getContactEmailIds(contactEmail: string): Promise<string>;
    searchTicket(filters: Array<hubspot.ticketsModels.Filter>): Promise<hubspot.ticketsModels.CollectionResponseWithTotalSimplePublicObjectForwardPaging>;
    updateTicket(ticketId: string, properties: hubspot.ticketsModels.SimplePublicObjectInput): Promise<hubspot.ticketsModels.SimplePublicObject>;
    addContactToWorkFlow({ contactEmail, workFlowId }: {
        contactEmail: any;
        workFlowId: any;
    }): Promise<string>;
    addContactToWorkFlowId(data: AddContactToWorkFlowDto): Promise<string>;
    getContactByPhoneNumber(phone: string): Promise<{
        response: import("http").IncomingMessage;
        body: hubspot.contactsModels.CollectionResponseWithTotalSimplePublicObjectForwardPaging;
    }>;
    createContact(phone: any, firstname: any, contact?: {}): Promise<{
        response: import("http").IncomingMessage;
        body: hubspot.contactsModels.SimplePublicObject;
    }>;
    createCallEngagement(contactId: string, downloadUrl: string, payload: RecordingCompletedPayloadObjectDto, ownerId: string): Promise<void>;
    getContactIdByTicketId(ticketId: string): Promise<string>;
    associateCallToContact(callId: string, contactId: string): Promise<SimplePublicObjectWithAssociations>;
    getOwnerByEmail(email: any): Promise<string>;
    updateContactByTicketId(ticketId: string, contactDetails: any): Promise<string>;
    getContactDetailsByEmail(contactEmail: string): Promise<ContactV1>;
    spendCredits(contactEmail: string, amount: number): Promise<void>;
    getContactCredits(contactEmail: string): Promise<number>;
    isAdminByEmail(email: string): Promise<boolean>;
    isSuperAdminByEmail(email: string): Promise<boolean>;
    updateAfyPassword(dto: UpdateAfyPasswordDto): Promise<string>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getActiveMemberListDeal(customerEmail: string): Promise<HSDataObject<Partial<DealProperties>> | SimplePublicObject | null>;
    getDealBySubscriptionId(subscriptionId: number): Promise<HSDataObject<Partial<DealProperties>> | SimplePublicObject | null>;
    createSubscriptionDeal(subscription: Subscription, customer: Customer, product: ProductDocument, lastPaymentDate?: string, funnelSource?: string): Promise<hubspot.dealsModels.SimplePublicObject>;
    updateLastPaymentDateWithNextRecurringDateDeal(dealId: string, lastPaymentDate: string, nextRecurringDate: string): Promise<hubspot.dealsModels.SimplePublicObject | null>;
    updateNewComponentDeal(dealId: string, subscription: Subscription, product: ProductDocument, lastPaymentDate: string): Promise<hubspot.dealsModels.SimplePublicObject>;
    associateDealToContact(contactId: string, dealId: string): Promise<hubspot.dealsModels.SimplePublicObjectWithAssociations>;
    getDealsAssociation(dealId: string): Promise<hubspot.dealsModels.CollectionResponseAssociatedIdForwardPaging>;
    deleteAssociation(dealId: string, association: string): Promise<void>;
    createLineItem(lineItemDeo: LineItemDto): Promise<hubspot.lineItemsModels.SimplePublicObject>;
    associateLineItemToDeal(lineItemId: string, dealId: string): Promise<hubspot.lineItemsModels.SimplePublicObjectWithAssociations | null>;
    findProductByName(name: string): Promise<hubspot.productsModels.SimplePublicObject | null>;
    createProduct(product: {
        title: string;
        value: number;
        chargifyId?: string;
    }): Promise<hubspot.productsModels.SimplePublicObject | null>;
    findProductByChargifyId(chargifyId: string): Promise<hubspot.productsModels.SimplePublicObject | null>;
    createOrUpdateProduct(productId: string, productDto: {
        title: string;
        value: number;
    }): Promise<hubspot.productsModels.SimplePublicObject>;
    createGuideOrderTicket(createGuideDto: CreateGuideOrderDto, orderId: string, customerEmail: string): Promise<CreateRmPrintTicketResponseDto>;
    createPrintQueueTicket(createTicketDto: CreateRmPrintTicketDto): Promise<CreateRmPrintTicketResponseDto>;
    createDealName(subscription: Subscription, customer: Customer, product: ProductDocument, customerSubscriptionName?: string): string;
    translateStripeStatusToHubspot(status: State): string;
    cleanProperties(propertyObject: hubspot.dealsModels.SimplePublicObjectInput): Promise<hubspot.dealsModels.SimplePublicObjectInput>;
    updateDeal(dealId: string, propertyObject: hubspot.dealsModels.SimplePublicObjectInput): Promise<hubspot.dealsModels.SimplePublicObject>;
    findActiveDealsByEmail(email: string): Promise<hubspot.dealsModels.CollectionResponseWithTotalSimplePublicObjectForwardPaging>;
    private customApiRequest;
    getListContactDetails(data: ContactToWorkFlowDto, urlData: HsUrlDataDto, method: string): Promise<ListOfContacts>;
    getListContactsWithWorkflow(data: ContactToWorkFlowDto): Promise<MessageErrorObj>;
    getHubspotProperties(objectType?: HubspotObjectTypes, archived?: boolean): Promise<Property[]>;
    verifyProduct(body: VerifyProductDto): Promise<ProductVerificationStatus>;
    enrollContactsToList(listId: number, emails: Array<string>): Promise<AddToListResponseV1>;
    getPipelineIdByDealId(dealId: string): Promise<Pipeline>;
    submitHSForms(formSubmission: FormSubmissionDto): Promise<FormSubmissionObject>;
}
