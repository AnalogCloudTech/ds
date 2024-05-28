"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var HubspotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspotService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const hubspot = require("@hubspot/api-client");
const api_client_1 = require("@hubspot/api-client");
const libphonenumber_js_1 = require("libphonenumber-js");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const id128_1 = require("id128");
const callDispositions_1 = require("./dto/callDispositions");
const timeFormatters_1 = require("../common/utils/timeFormatters");
const dateFormatters_1 = require("../common/utils/dateFormatters");
const types_1 = require("./domain/types");
const string_1 = require("../../../../internal/utils/string");
const dateFormatters_2 = require("../../../../internal/common/utils/dateFormatters");
const constants_1 = require("./constants");
const date_1 = require("../../../../internal/utils/date");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../../internal/common/contexts");
const functions_1 = require("../../../../internal/utils/functions");
const types_2 = require("../../../../onboard/products/domain/types");
const axios_1 = require("axios");
let HubspotService = HubspotService_1 = class HubspotService {
    constructor(configService, hubspotClient, appEnv, httpForms, logger) {
        this.configService = configService;
        this.hubspotClient = hubspotClient;
        this.appEnv = appEnv;
        this.httpForms = httpForms;
        this.logger = logger;
    }
    static cleanName(name) {
        if (!name || name === '' || name === 'anonymous') {
            return 'John Doe Zoom';
        }
        return name;
    }
    static cleanPhone(phone) {
        const parsedPhone = phone.charAt(0) === '+'
            ? (0, libphonenumber_js_1.default)('' + phone || '')
            : (0, libphonenumber_js_1.default)('+' + phone || '');
        if (!parsedPhone || !parsedPhone.isValid()) {
            return null;
        }
        return parsedPhone.formatNational().replace(/[^0-9]/g, '');
    }
    async findOrCreateAutoLoginToken(id) {
        let contact;
        try {
            contact = await this.hubspotClient.crm.contacts.basicApi.getById(id, [
                'afy_customer_login_token',
            ]);
            let afy_customer_login_token = contact.body.properties.afy_customer_login_token;
            if (!afy_customer_login_token) {
                afy_customer_login_token = id128_1.Uuid4.generate().toCanonical();
                const properties = { afy_customer_login_token };
                await this.hubspotClient.crm.contacts.basicApi.update(id, {
                    properties,
                });
            }
            return afy_customer_login_token;
        }
        catch (error) {
            return false;
        }
    }
    async authenticate(email, password) {
        let contact;
        try {
            contact = await this.hubspotClient.crm.contacts.basicApi.getById(email, ['afy_password_encrypted'], [], false, 'email');
            const hash = (0, lodash_1.get)(contact, ['body', 'properties', 'afy_password_encrypted'], '');
            return await bcrypt.compare(password, hash);
        }
        catch (error) {
            return false;
        }
    }
    async setContactOwnerIfNull(contactId, ownerId) {
        if (!contactId || !ownerId) {
            throw new common_1.HttpException({ message: `${contactId ? 'coachId' : 'contactId'} was not provided` }, common_1.HttpStatus.BAD_REQUEST);
        }
        const ownerProperty = 'hubspot_owner_id';
        const contact = await this.getContactById(contactId, [ownerProperty]);
        const ownerExists = (0, lodash_1.get)(contact, ['properties', ownerProperty]);
        if (ownerExists) {
            return;
        }
        const data = {
            properties: { [ownerProperty]: ownerId },
        };
        await this.updateContactById(contactId, data);
    }
    async createOrUpdateContact(dto) {
        const email = dto.email;
        this.logger.log({
            payload: {
                method: 'HubspotService@createOrUpdateContact',
                message: 'checking dto values',
                params: dto,
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        try {
            const contactData = await this.getContactId(email);
            this.logger.log({
                payload: {
                    method: 'HubspotService@createOrUpdateContact',
                    message: 'checking contactData',
                    params: contactData,
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
            if (contactData) {
                this.logger.log({
                    payload: {
                        method: 'HubspotService@createOrUpdateContact',
                        message: 'customer exists, update...',
                        usageDate: luxon_1.DateTime.now(),
                    },
                }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
                const { body: contact } = await this.hubspotClient.crm.contacts.basicApi.update(email, { properties: Object.assign({}, dto) }, 'email');
                this.logger.log({
                    payload: {
                        method: 'HubspotService@createOrUpdateContact',
                        message: 'checking updated contact values',
                        params: contact,
                        usageDate: luxon_1.DateTime.now(),
                    },
                }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
                return contact.id;
            }
            this.logger.log({
                payload: {
                    method: 'HubspotService@createOrUpdateContact',
                    message: 'contact doesnt exists. creating',
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
            const { body: contact } = await this.hubspotClient.crm.contacts.basicApi.create({
                properties: Object.assign({}, dto),
            });
            this.logger.log({
                payload: {
                    method: 'HubspotService@createOrUpdateContact',
                    message: 'checking created contact values',
                    params: contact,
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
            return contact.id;
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_1.HttpException({ message: err.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateProfileAvatar(dto) {
        const email = dto.email;
        let contact;
        try {
            contact = await this.hubspotClient.crm.contacts.basicApi.update(email, { properties: Object.assign({}, dto) }, 'email');
            return contact.body.id;
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_1.HttpException(err.response.body, err.response.statusCode);
            }
        }
    }
    async getContactOwnerId(contactId) {
        const ownerProperty = 'hubspot_owner_id';
        const properties = [ownerProperty];
        const contact = await this.getContactById(contactId, properties);
        return (0, lodash_1.get)(contact, ['properties', ownerProperty], null);
    }
    async updateRmUserProperties({ email }) {
        if (!email) {
            throw new common_1.HttpException({ message: 'Email is required' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const id = await this.getContactId(email);
        if (!id) {
            throw new common_1.HttpException({ message: 'Contact not found' }, common_1.HttpStatus.NOT_FOUND);
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
                [properties.hideBooks]: 'Active',
                [properties.isPilotCustomer]: 'Yes',
            },
        });
    }
    async updateCreditsAndPackages(data) {
        const propertyNames = {
            packages: 'afy_package',
            credits: 'afy_book_credits',
        };
        const packages = (0, lodash_1.get)(data, ['packages'], []);
        const credits = +(0, lodash_1.get)(data, ['credits'], 0);
        const requestProperties = [...Object.values(propertyNames)];
        const contact = await this.getContactById(data.id, requestProperties);
        const oldPackages = (0, lodash_1.split)((0, lodash_1.get)(contact, ['properties', propertyNames.packages], ''), ';').filter(Boolean);
        const oldCredits = +(0, lodash_1.get)(contact, ['properties', propertyNames.credits], 0);
        const newCredits = oldCredits + credits;
        const newPackages = (0, lodash_1.union)(oldPackages, packages);
        const packagesString = (0, lodash_1.join)(newPackages, ';');
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
    async updateContactById(id, requestProperties) {
        console.info({ id, requestProperties });
        const response = await this.hubspotClient.crm.contacts.basicApi.update(id, requestProperties);
        return response.body;
    }
    async getContactById(id, properties) {
        const request = await this.hubspotClient.crm.contacts.basicApi.getById(id, properties);
        return request.body;
    }
    async createTicket(createTicket) {
        var _a;
        const { name: fullName, bookName, email, phone, content } = createTicket;
        const firstname = fullName.split(' ')[0];
        const contactData = await this.getContactId(email);
        let alreadyContactId;
        let contactObj;
        if (contactData != '404') {
            alreadyContactId = contactData;
        }
        else {
            contactObj = await this.createContact(`1${phone}`, firstname, {
                email,
                lastname: fullName.split(' ').pop(),
            });
        }
        await this.addContactToWorkFlow({
            contactEmail: email,
            workFlowId: '11324',
        });
        let ticketId = '';
        const contactId = alreadyContactId || ((_a = contactObj === null || contactObj === void 0 ? void 0 : contactObj.body) === null || _a === void 0 ? void 0 : _a.id);
        const properties = {
            hs_pipeline: this.configService.get('strayDomainConstants.HS_PIPELINE'),
            hs_pipeline_stage: this.configService.get('strayDomainConstants.HS_PIPELINE_STAGE'),
            hubspot_owner_id: this.configService.get('strayDomainConstants.HS_OWNER_ID'),
            content: `Book Name: ${bookName}\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nContact Link: https://app.hubspot.com/contacts/3424767/contact/${contactId}/\nUrl: ${content}`,
            subject: `Generate ${bookName} for ${fullName}`,
        };
        const SimplePublicObjectInput = { properties };
        try {
            const ticketObj = await this.hubspotClient.crm.tickets.basicApi.create(SimplePublicObjectInput);
            ticketId = ticketObj.body.id;
            await this.hubspotClient.crm.tickets.associationsApi.create(ticketId, 'contact', contactId, 'ticket_to_contact');
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_1.HttpException({ message: err.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return { ticketId, contactId };
    }
    async getContactId(contactEmail) {
        try {
            const PublicObjectSearchRequest = {
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
            const result = await this.hubspotClient.crm.contacts.searchApi.doSearch(PublicObjectSearchRequest);
            return (0, lodash_1.get)((0, lodash_1.first)((0, lodash_1.get)(result, ['body', 'results'])), ['id']);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getContactEmailIds(contactEmail) {
        try {
            const PublicObjectSearchRequest = {
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
            const result = await this.hubspotClient.crm.contacts.searchApi.doSearch(PublicObjectSearchRequest);
            return (0, lodash_1.get)((0, lodash_1.first)((0, lodash_1.get)(result, ['body', 'results'])), [
                'properties',
                'email',
            ]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async searchTicket(filters) {
        const filterGroups = [
            { filters },
        ];
        const sorts = [
            JSON.stringify({
                propertyName: 'afy_order_number',
                direction: 'descending',
            }),
        ];
        const searchRequest = {
            properties: [''],
            limit: 2,
            after: 0,
            filterGroups,
            sorts,
        };
        const hsDealResponse = await this.hubspotClient.crm.tickets.searchApi.doSearch(searchRequest);
        const hasResults = !!(0, lodash_1.get)(hsDealResponse, ['body']);
        if (!hasResults) {
            return null;
        }
        return hsDealResponse.body;
    }
    async updateTicket(ticketId, properties) {
        const ticketData = await this.hubspotClient.crm.tickets.basicApi.update(ticketId, properties);
        const hasResults = !!(0, lodash_1.get)(ticketData, ['body']);
        if (!hasResults) {
            return null;
        }
        return ticketData.body;
    }
    async addContactToWorkFlow({ contactEmail, workFlowId }) {
        try {
            const emails = [contactEmail];
            const url = `/contacts/v1/lists/${workFlowId}/add`;
            await this.customApiRequest('POST', url, {
                emails,
            });
            return 'Successfully added';
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async addContactToWorkFlowId(data) {
        try {
            const url = `/automation/v2/workflows/${data.workFlowId}/enrollments/contacts/${data.contactEmail}`;
            await this.customApiRequest('POST', url, {});
            return 'Successfully added';
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    getContactByPhoneNumber(phone) {
        const formatedNumber = HubspotService_1.cleanPhone(phone);
        if (!formatedNumber) {
            return null;
        }
        const sort = JSON.stringify({
            propertyName: 'createdate',
            direction: 'DESCENDING',
        });
        const properties = ['createdate', 'firstname', 'lastname', 'email'];
        const limit = 1;
        const after = 0;
        const requestObject = {
            filterGroups: [],
            query: formatedNumber,
            sorts: [sort],
            properties,
            limit,
            after,
        };
        return this.hubspotClient.crm.contacts.searchApi.doSearch(requestObject);
    }
    createContact(phone, firstname, contact = {}) {
        let properties = {
            phone: HubspotService_1.cleanPhone(phone) || '',
            firstname: HubspotService_1.cleanName(firstname),
        };
        properties = Object.assign(Object.assign({}, properties), contact);
        const input = {
            properties,
        };
        return this.hubspotClient.crm.contacts.basicApi.create(input);
    }
    async createCallEngagement(contactId, downloadUrl, payload, ownerId) {
        try {
            const durationObj = (0, timeFormatters_1.millisecondsToHuman)(payload.duration);
            const date = (0, dateFormatters_1.timeStampToHumanReadable)(payload.date_time, dateFormatters_1.TimeZones.EST);
            const hsCallBody = `
    <strong>date:</strong> ${date} <br>
    <strong>call type:</strong> ${payload.direction}<br>
    <strong>caller number:</strong> ${payload.caller_number}<br>
    <strong>callee number:</strong> ${payload.callee_number}<br>
    <strong>call duration:</strong> ${(0, timeFormatters_1.toTwoDigits)(durationObj.hours)}:${(0, timeFormatters_1.toTwoDigits)(durationObj.minutes)}:${(0, timeFormatters_1.toTwoDigits)(durationObj.seconds)}<br>
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
                    hs_call_disposition: callDispositions_1.CallDisposition.CONNECTED,
                },
            };
            const call = await this.hubspotClient.crm.objects.basicApi.create('calls', body);
            const callId = call.body.id;
            await this.associateCallToContact(callId, contactId);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    async getContactIdByTicketId(ticketId) {
        try {
            const url = `/crm/v3/objects/tickets/${ticketId}/?associations=contacts`;
            const response = await this.customApiRequest('GET', url, {});
            const contactId = ((0, lodash_1.get)(response, ['associations', 'contacts', 'results', 0, 'id']));
            return contactId;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({
                    message: 'Error while getting contactId while using getContactIdByTicketId',
                    method: 'getContactIdByTicketId',
                    error: error.message,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async associateCallToContact(callId, contactId) {
        try {
            const result = await this.hubspotClient.crm.objects.associationsApi.create('calls', callId, 'contact', contactId, '194');
            return result.body;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    async getOwnerByEmail(email) {
        if (!Boolean(email)) {
            return '';
        }
        const request = await this.hubspotClient.crm.owners.ownersApi.getPage(email);
        const ownerId = (0, lodash_1.get)(request, ['body', 'results', '0', 'id'], '');
        return ownerId;
    }
    async updateContactByTicketId(ticketId, contactDetails) {
        var _a, _b, _c;
        const apiResponse = await this.hubspotClient.crm.tickets.basicApi.getById(ticketId);
        if (apiResponse.body.id) {
            const { hs_pipeline, hs_pipeline_stage } = apiResponse.body.properties;
            const hsPipeline = this.configService.get('strayDomainConstants.HS_PIPELINE');
            const hsPipelineStage = this.configService.get('strayDomainConstants.HS_PIPELINE_STAGE');
            if (hs_pipeline !== hsPipeline || hs_pipeline_stage !== hsPipelineStage) {
                throw new common_1.HttpException({ message: 'There are no open tickets with the provided id' }, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else {
            throw new common_1.HttpException({ message: 'No ticket found with the provided id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const associations = await this.hubspotClient.crm.tickets.associationsApi.getAll(ticketId, 'contact');
        const contactId = ((_c = (_b = (_a = associations.body) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.find(({ type }) => type === 'ticket_to_contact')) === null || _c === void 0 ? void 0 : _c.id) || '';
        if (contactId) {
            const properties = Object.assign(Object.assign({}, (0, lodash_1.pick)(contactDetails, ['address', 'state', 'city', 'zip', 'country'])), { text_message_opt_in: contactDetails.textMessageOptIn });
            const SimplePublicObjectInput = { properties };
            try {
                await this.hubspotClient.crm.contacts.basicApi.update(contactId, SimplePublicObjectInput);
                await this.addContactToWorkFlow({
                    contactEmail: contactDetails.email,
                    workFlowId: '11325',
                });
                return 'Successfully updated';
            }
            catch (err) {
                if (err instanceof Error) {
                    throw new common_1.HttpException({ message: err.message }, common_1.HttpStatus.BAD_REQUEST);
                }
            }
        }
        else {
            throw new common_1.HttpException({ message: 'No contacts found with associated ticket' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getContactDetailsByEmail(contactEmail) {
        try {
            const url = `/contacts/v1/contact/email/${contactEmail}/profile`;
            const response = await this.customApiRequest('GET', url, {});
            return response;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async spendCredits(contactEmail, amount) {
        const currentCredits = await this.getContactCredits(contactEmail);
        if (currentCredits < amount) {
            throw new common_1.HttpException({ message: 'Not enough credits' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const newCredits = currentCredits - amount;
        const contactId = await this.getContactId(contactEmail);
        const properties = {
            afy_book_credits: newCredits.toString(),
        };
        await this.updateContactById(contactId, { properties });
    }
    async getContactCredits(contactEmail) {
        const contactDetail = await this.getContactDetailsByEmail(contactEmail);
        const data = (0, lodash_1.get)(contactDetail, ['properties', 'afy_book_credits', 'value'], 0);
        return +data;
    }
    async isAdminByEmail(email) {
        var _a, _b;
        const data = (await this.getContactDetailsByEmail(email));
        const isAdmin = ((_b = (_a = data === null || data === void 0 ? void 0 : data.properties) === null || _a === void 0 ? void 0 : _a.afy_admin) === null || _b === void 0 ? void 0 : _b.value) === 'Yes';
        return isAdmin;
    }
    async isSuperAdminByEmail(email) {
        var _a, _b;
        const data = (await this.getContactDetailsByEmail(email));
        const isSuperAdmin = ((_b = (_a = data === null || data === void 0 ? void 0 : data.properties) === null || _a === void 0 ? void 0 : _a.afy_super_admin) === null || _b === void 0 ? void 0 : _b.value) === 'Yes';
        return isSuperAdmin;
    }
    async updateAfyPassword(dto) {
        this.logger.log({
            payload: {
                method: 'HubspotService@updateAfyPassword',
                message: 'checking dto values',
                params: dto,
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        const hubspotDto = {
            afy_password: dto.password,
            afy_password_encrypted: dto.encryptedPassword,
        };
        this.logger.log({
            payload: {
                method: 'HubspotService@updateAfyPassword',
                message: 'checking hubspotDto values',
                params: hubspotDto,
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        try {
            const contact = await this.hubspotClient.crm.contacts.basicApi.update(dto.email, { properties: Object.assign({}, hubspotDto) }, 'email');
            this.logger.log({
                payload: {
                    method: 'HubspotService@updateAfyPassword',
                    message: 'checking update contact response',
                    params: contact,
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
            return contact.body.id;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getAllBlogPosts() {
        var _a, _b;
        try {
            const blogs = (_b = (_a = (await this.hubspotClient.cms.blogs.blogPosts.blogPostApi.getPage())) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.results;
            return blogs;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getActiveMemberListDeal(customerEmail) {
        var _a;
        const filters = [
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
        const filterGroups = [{ filters }];
        const sorts = [
            JSON.stringify({
                propertyName: 'chargify_subscription_id',
                direction: 'descending',
            }),
        ];
        const searchRequest = {
            properties: ['dealstage', 'chargify_subscription_id'],
            limit: 5,
            after: 0,
            filterGroups,
            sorts,
        };
        const hsDealResponse = await this.hubspotClient.crm.deals.searchApi.doSearch(searchRequest);
        const total = (0, lodash_1.get)(hsDealResponse, ['body', 'total']);
        const hasResults = !!total;
        if (!hasResults) {
            return null;
        }
        if (total > 1) {
            const results = (_a = hsDealResponse === null || hsDealResponse === void 0 ? void 0 : hsDealResponse.body) === null || _a === void 0 ? void 0 : _a.results;
            const deal = results.find((result) => { var _a; return ((_a = result === null || result === void 0 ? void 0 : result.properties) === null || _a === void 0 ? void 0 : _a.dealstage) === constants_1.DEAL_DEAL_STAGE_ID; });
            if (deal) {
                return deal;
            }
        }
        return (0, lodash_1.get)(hsDealResponse, ['body', 'results', '0']);
    }
    async getDealBySubscriptionId(subscriptionId) {
        var _a;
        const filters = [
            {
                propertyName: 'chargify_subscription_id',
                operator: hubspot.dealsModels.Filter.OperatorEnum.Eq,
                value: subscriptionId.toString(10),
            },
        ];
        const filterGroups = [{ filters }];
        const sorts = [
            JSON.stringify({
                propertyName: 'chargify_subscription_id',
                direction: 'descending',
            }),
        ];
        const searchRequest = {
            properties: ['amount', 'status', 'dealstage', 'chargify_subscription_id'],
            limit: 5,
            after: 0,
            filterGroups,
            sorts,
        };
        const hsDealResponse = await this.hubspotClient.crm.deals.searchApi.doSearch(searchRequest);
        const total = (0, lodash_1.get)(hsDealResponse, ['body', 'total']);
        const hasResults = !!total;
        if (!hasResults) {
            return null;
        }
        if (total > 1) {
            const results = (_a = hsDealResponse === null || hsDealResponse === void 0 ? void 0 : hsDealResponse.body) === null || _a === void 0 ? void 0 : _a.results;
            const deal = results.find((result) => { var _a; return ((_a = result === null || result === void 0 ? void 0 : result.properties) === null || _a === void 0 ? void 0 : _a.dealstage) === constants_1.DEAL_DEAL_STAGE_ID; });
            if (deal) {
                return deal;
            }
        }
        return (0, lodash_1.get)(hsDealResponse, ['body', 'results', '0']);
    }
    async createSubscriptionDeal(subscription, customer, product, lastPaymentDate, funnelSource) {
        var _a, _b, _c, _d;
        lastPaymentDate = !lastPaymentDate
            ? luxon_1.DateTime.now().toFormat('yyyy-LL-dd')
            : (0, dateFormatters_2.convertToHSDate)(lastPaymentDate);
        const objectInput = {
            properties: {
                [(_a = product.productProperty) !== null && _a !== void 0 ? _a : types_2.HubspotProductProperty.AUTHORIFY_PRODUCT]: product.title,
                [(_b = product.priceProperty) !== null && _b !== void 0 ? _b : types_2.HubspotPriceProperty.RECURRING_REVENUE_AMOUNT]: (_c = product.value) === null || _c === void 0 ? void 0 : _c.toString(10),
                dealname: this.createDealName(subscription, customer, product),
                funnel_source: funnelSource,
                pipeline: constants_1.DEAL_PIPELINE_ID,
                dealstage: constants_1.DEAL_DEAL_STAGE_ID,
                status: this.translateStripeStatusToHubspot(subscription.state),
                amount: (_d = product.value) === null || _d === void 0 ? void 0 : _d.toString(10),
                chargify_subscription_id: subscription.id.toString(10),
                contact_email: customer.email,
                first_name: customer.first_name,
                last_name: customer.last_name,
                next_recurring_date: subscription.current_period_ends_at
                    ? (0, dateFormatters_2.convertToHSDate)(subscription.current_period_ends_at)
                    : luxon_1.DateTime.now().plus({ months: 1 }).toFormat('yyyy-LL-dd'),
                last_payment_date: lastPaymentDate,
            },
        };
        this.logger.log({
            payload: {
                email: customer.email,
                usageDate: luxon_1.DateTime.now(),
                method: 'createSubscriptionDeal',
                operation: 'creating hubspot deal',
                objectInput,
            },
        }, contexts_1.CONTEXT_HUBSPOT);
        const { body: createdDeal } = await this.hubspotClient.crm.deals.basicApi.create(objectInput);
        return createdDeal;
    }
    async updateLastPaymentDateWithNextRecurringDateDeal(dealId, lastPaymentDate, nextRecurringDate) {
        const pipelineId = await this.getPipelineIdByDealId(dealId);
        if ((pipelineId === null || pipelineId === void 0 ? void 0 : pipelineId.value) === constants_1.DEAL_PIPELINE_ID) {
            const objectInput = {
                properties: {
                    last_payment_date: lastPaymentDate,
                    next_recurring_date: nextRecurringDate,
                },
            };
            this.logger.log({ updateDeal: objectInput }, contexts_1.CONTEXT_HUBSPOT);
            const { body: updatedDeal } = await this.hubspotClient.crm.deals.basicApi.update(dealId, objectInput);
            return updatedDeal;
        }
    }
    async updateNewComponentDeal(dealId, subscription, product, lastPaymentDate) {
        var _a, _b;
        lastPaymentDate = !lastPaymentDate
            ? luxon_1.DateTime.now().toFormat('yyyy-LL-dd')
            : (0, dateFormatters_2.convertToHSDate)(lastPaymentDate);
        const objectInput = {
            properties: {
                last_payment_date: lastPaymentDate,
                [(_a = product.productProperty) !== null && _a !== void 0 ? _a : types_2.HubspotProductProperty.AUTHORIFY_PRODUCT]: product.title,
                [(_b = product.priceProperty) !== null && _b !== void 0 ? _b : types_2.HubspotPriceProperty.RECURRING_REVENUE_AMOUNT]: product.value.toString(),
                dealname: this.createDealName(subscription, subscription.customer, product, subscription.name),
                next_recurring_date: subscription.current_period_ends_at
                    ? (0, dateFormatters_2.convertToHSDate)(subscription.current_period_ends_at)
                    : luxon_1.DateTime.now().plus({ months: 1 }).toFormat('yyyy-LL-dd'),
                status: this.translateStripeStatusToHubspot(subscription.state),
                amount: product.value.toString(),
            },
        };
        console.info({ objectInput });
        const pipelineId = await this.getPipelineIdByDealId(dealId);
        if ((pipelineId === null || pipelineId === void 0 ? void 0 : pipelineId.value) === constants_1.DEAL_PIPELINE_ID) {
            const { body: updatedDeal } = await this.hubspotClient.crm.deals.basicApi.update(dealId, objectInput);
            return updatedDeal;
        }
    }
    async associateDealToContact(contactId, dealId) {
        console.info({ contactId, dealId });
        const { body: association } = await this.hubspotClient.crm.deals.associationsApi.create(dealId, 'contact', contactId, 'deal_to_contact');
        console.info({ association });
        return association;
    }
    async getDealsAssociation(dealId) {
        const responseData = await this.hubspotClient.crm.deals.associationsApi.getAll(dealId, 'deal');
        return responseData.body;
    }
    async deleteAssociation(dealId, association) {
        try {
            await this.hubspotClient.crm.deals.associationsApi.archive(dealId, 'deal', association, 'deal_to_contact');
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async createLineItem(lineItemDeo) {
        const input = {
            properties: Object.assign({}, lineItemDeo),
        };
        const { body: createdLineItem } = await this.hubspotClient.crm.lineItems.basicApi.create(input);
        return createdLineItem;
    }
    async associateLineItemToDeal(lineItemId, dealId) {
        console.info({ lineItemId, dealId });
        const pipelineId = await this.getPipelineIdByDealId(dealId);
        if ((pipelineId === null || pipelineId === void 0 ? void 0 : pipelineId.value) === constants_1.DEAL_PIPELINE_ID) {
            const { body: association } = await this.hubspotClient.crm.lineItems.associationsApi.create(lineItemId, 'deal', dealId, 'line_item_to_deal');
            console.info({ association });
            return association;
        }
    }
    async findProductByName(name) {
        const filters = [
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
        const filterGroups = [
            { filters },
        ];
        const requestSearch = {
            filterGroups,
            after: 0,
            limit: 1,
            properties: ['amount'],
            sorts: [sort],
        };
        const hubspotProductsResponse = await this.hubspotClient.crm.products.searchApi.doSearch(requestSearch);
        const hasResults = !!(0, lodash_1.get)(hubspotProductsResponse, ['body', 'total']);
        if (!hasResults) {
            return null;
        }
        return (0, lodash_1.get)(hubspotProductsResponse, ['body', 'results', '0']);
    }
    async createProduct(product) {
        try {
            if (!product) {
                return null;
            }
            const productBody = {
                properties: Object.assign({ name: product.title, price: product.value.toString() }, (product.chargifyId && { chargifyId: product.chargifyId })),
            };
            const newProduct = await this.hubspotClient.crm.products.basicApi.create(productBody);
            return newProduct.body;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async findProductByChargifyId(chargifyId) {
        const filters = [
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
        const filterGroups = [
            { filters },
        ];
        const requestSearch = {
            filterGroups,
            after: 0,
            limit: 1,
            properties: ['amount'],
            sorts: [sort],
        };
        const hubspotProductsResponse = await this.hubspotClient.crm.products.searchApi.doSearch(requestSearch);
        const hasResults = !!(0, lodash_1.get)(hubspotProductsResponse, ['body', 'total']);
        if (!hasResults) {
            return null;
        }
        return (0, lodash_1.get)(hubspotProductsResponse, ['body', 'results', '0']);
    }
    async createOrUpdateProduct(productId, productDto) {
        const hubspotProductNew = await this.findProductByChargifyId(productId);
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                method: 'createOrUpdateProduct',
                productId,
                hubspotProductNew,
            },
        }, contexts_1.CONTEXT_HUBSPOT);
        if (!hubspotProductNew) {
            return this.createProduct(productDto);
        }
        return hubspotProductNew;
    }
    async createGuideOrderTicket(createGuideDto, orderId, customerEmail) {
        var _a;
        const { practiceEmail: email, frontCover, practiceAddress: address, practicePhone: phone, practiceLogo: logo, practiceWebsite: website, guideName, quantity, shippingAddress, } = createGuideDto;
        const contactData = await this.getContactDetailsByEmail(customerEmail);
        const firstname = (0, lodash_1.get)(contactData, ['properties', 'firstname', 'value'], '');
        const lastname = (0, lodash_1.get)(contactData, ['properties', 'lastname', 'value'], '');
        const fullname = `${firstname} ${lastname}`;
        const setupTicketOwner = (0, lodash_1.get)(contactData, ['properties', 'setup_ticket_owner', 'value'], '');
        const contactIdDefault = (0, lodash_1.get)(contactData, ['canonical-vid'], null);
        let alreadyContactId;
        let contactObj;
        if (contactIdDefault != '404') {
            alreadyContactId = contactIdDefault;
        }
        else {
            contactObj = await this.createContact(`1${phone}`, firstname, {
                email,
                lastname,
            });
        }
        await this.addContactToWorkFlow({
            contactEmail: email,
            workFlowId: constants_1.WORKFLOW_ID,
        });
        let ticketId = '';
        const contactId = alreadyContactId || ((_a = contactObj === null || contactObj === void 0 ? void 0 : contactObj.body) === null || _a === void 0 ? void 0 : _a.id);
        const subject = `${orderId} - Guide Setup - ${fullname}`;
        const completeAddress = `${address.addressLine1}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`;
        const properties = {
            hs_pipeline: this.configService.get('sendToPrintConstants.HS_DENTIST_GUIDE_PIPELINE'),
            hs_pipeline_stage: this.configService.get('sendToPrintConstants.HS_DENTIST_GUIDE_PIPELINE_STAGE'),
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
            await this.hubspotClient.crm.tickets.associationsApi.create(ticketId, 'contact', contactId, 'ticket_to_contact');
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return { ticketId, contactId };
    }
    async createPrintQueueTicket(createTicketDto) {
        var _a, _b;
        const { email, coverUrl, magazineMonth, additionalInformation, rmProofLink, rmMemberSiteLink, rmShippedMagazineLink, adminFullName, } = createTicketDto;
        const contactData = await this.getContactDetailsByEmail(email);
        const firstname = (0, lodash_1.get)(contactData, ['properties', 'firstname', 'value'], '');
        const parsedMonth = (_a = date_1.MonthsLong[`${magazineMonth === null || magazineMonth === void 0 ? void 0 : magazineMonth.toLowerCase()}`]) !== null && _a !== void 0 ? _a : '';
        const lastname = (0, lodash_1.get)(contactData, ['properties', 'lastname', 'value'], '');
        const fullname = `${firstname} ${lastname}`;
        const phone = (0, lodash_1.get)(contactData, ['properties', 'phone', 'value'], '');
        const setupTicketOwner = (0, lodash_1.get)(contactData, ['properties', 'setup_ticket_owner', 'value'], '');
        const contactIdDefault = (0, lodash_1.get)(contactData, ['canonical-vid'], null);
        let alreadyContactId;
        let contactObj;
        if (contactIdDefault != '404') {
            alreadyContactId = contactIdDefault;
        }
        else {
            contactObj = await this.createContact(`1${phone}`, firstname, {
                email,
                lastname,
            });
        }
        const workFlowId = '11324';
        await this.addContactToWorkFlow({
            contactEmail: email,
            workFlowId,
        });
        let ticketId = '';
        const contactId = alreadyContactId || ((_b = contactObj === null || contactObj === void 0 ? void 0 : contactObj.body) === null || _b === void 0 ? void 0 : _b.id);
        const prefix = adminFullName ? `ADMIN[${adminFullName}] - ` : 'DMP - ';
        const subject = `${prefix}${(0, lodash_1.get)(contactData, ['properties', 'rm_hub_guid', 'value'], '')} ${(0, lodash_1.upperFirst)(parsedMonth)} RM Setup - ${fullname}`;
        const properties = {
            hs_pipeline: this.configService.get('sendToPrintConstants.HS_PIPELINE'),
            hs_pipeline_stage: this.configService.get('sendToPrintConstants.HS_PIPELINE_STAGE'),
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
            await this.hubspotClient.crm.tickets.associationsApi.create(ticketId, 'contact', contactId, 'ticket_to_contact');
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return { ticketId, contactId };
    }
    createDealName(subscription, customer, product, customerSubscriptionName = 'John Doe') {
        const customerName = (0, lodash_1.get)(customer, ['first_name']) + ' ' + (0, lodash_1.get)(customer, ['last_name']) ||
            customerSubscriptionName;
        const status = (0, lodash_1.get)(subscription, ['state']);
        const trialing = status === 'trialing' ? ' - trialing' : '';
        return `${customerName} - ${product.title}${trialing}`;
    }
    translateStripeStatusToHubspot(status) {
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
        return (0, string_1.capitalizeFirstLetter)(status);
    }
    async cleanProperties(propertyObject) {
        const cleanProperties = {};
        for (const property in propertyObject.properties) {
            if (property !== undefined) {
                cleanProperties[property] = propertyObject.properties[property];
            }
        }
        return {
            properties: Object.assign({}, cleanProperties),
        };
    }
    async updateDeal(dealId, propertyObject) {
        try {
            const cleanPropertyObject = await this.cleanProperties(propertyObject);
            const pipelineId = await this.getPipelineIdByDealId(dealId);
            if ((pipelineId === null || pipelineId === void 0 ? void 0 : pipelineId.value) === constants_1.DEAL_PIPELINE_ID) {
                const { body: updatedDeal } = await this.hubspotClient.crm.deals.basicApi.update(dealId, cleanPropertyObject);
                this.logger.log({
                    payload: {
                        method: 'updateDeal',
                        message: 'Success Update Deal',
                        usageDate: luxon_1.DateTime.now(),
                        updatedDeal,
                        dealId,
                        cleanPropertyObject,
                    },
                }, contexts_1.CONTEXT_CHARGIFY_DEAL);
                return updatedDeal;
            }
        }
        catch (err) {
            if (err instanceof Error) {
                const cleanPropertyObject = await this.cleanProperties(propertyObject);
                this.logger.log({
                    payload: {
                        method: 'updateDeal',
                        message: 'Error Update Deal',
                        usageDate: luxon_1.DateTime.now(),
                        error: err.message,
                        stack: err === null || err === void 0 ? void 0 : err.stack,
                        dealId,
                        cleanPropertyObject,
                    },
                }, contexts_1.CONTEXT_CHARGIFY_DEAL);
                throw new common_1.HttpException({ message: err.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async findActiveDealsByEmail(email) {
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
            const response = await this.customApiRequest('POST', url, body);
            return response;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async customApiRequest(method, URL, body) {
        try {
            const options = {
                method: method,
                path: URL,
                body: body,
            };
            const result = await this.hubspotClient.apiRequest(options);
            return result.body;
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_1.HttpException({ message: err.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getListContactDetails(data, urlData, method) {
        try {
            const url = `/contacts/v1/lists/${data.listId}/contacts/all?count=${urlData.contactCount}&vidOffset=${urlData.vidOffset}`;
            const response = await this.customApiRequest(method, url, {});
            return response;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getListContactsWithWorkflow(data) {
        const urlData = { contactCount: 10, vidOffset: 1 };
        let hasMore = true;
        const errors = [];
        while (hasMore) {
            await (0, functions_1.sleep)(1000);
            const response = await this.getListContactDetails(data, urlData, 'GET');
            hasMore = response['has-more'];
            urlData.vidOffset = response['vid-offset'];
            await Promise.all(response.contacts.map(async (dataDetails) => {
                try {
                    const strVid = dataDetails.vid.toString();
                    const identitiesProfiles = (0, lodash_1.get)(dataDetails, ['identity-profiles']);
                    const { identities } = identitiesProfiles.find((ip) => ip.vid.toString() === strVid);
                    const contactEmail = identities.find((i) => i.type === 'EMAIL' && i['is-primary']);
                    const resData = {
                        contactEmail: contactEmail === null || contactEmail === void 0 ? void 0 : contactEmail.value,
                        workFlowId: data.workFlowId,
                    };
                    return this.addContactToWorkFlowId(resData);
                }
                catch (err) {
                    errors.push(err);
                }
            }));
        }
        return {
            message: `All Contacts are successfully tagged with WorkflowId ${data.workFlowId}`,
            errors: errors.length,
        };
    }
    async getHubspotProperties(objectType = types_1.HubspotObjectTypes.CONTACT, archived = false) {
        const url = `/crm/v3/properties/${objectType}?archived=${archived}`;
        try {
            const response = await this.customApiRequest('get', url, {});
            return response.results;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({
                    error: error.message,
                    message: 'Could not fetch hubspot properties.',
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async verifyProduct(body) {
        const { productName, propertyKey = 'name', propertyValue = 'Authorify Products', } = body;
        const properties = await this.getHubspotProperties(types_1.HubspotObjectTypes.DEAL);
        let verified = false;
        const authorifyProducts = properties.find((property) => property[propertyKey] === propertyValue);
        if (authorifyProducts) {
            const matchedProduct = authorifyProducts.options.find((product) => product.value == productName);
            verified = (matchedProduct === null || matchedProduct === void 0 ? void 0 : matchedProduct.value) && !(matchedProduct === null || matchedProduct === void 0 ? void 0 : matchedProduct.hidden);
        }
        const productVerification = {
            success: verified,
            message: constants_1.VERIFICATION_STATUS[`${verified}`],
        };
        return productVerification;
    }
    async enrollContactsToList(listId, emails) {
        const url = `/contacts/v1/lists/${listId}/add`;
        return this.customApiRequest('POST', url, { emails });
    }
    async getPipelineIdByDealId(dealId) {
        const url = `/deals/v1/deal/${dealId}`;
        try {
            const response = await this.customApiRequest('get', url, {});
            const value = (0, lodash_1.get)(response, ['properties', 'pipeline', 'value']);
            return { value };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({
                    message: 'unable to get pipeline id',
                    error: error === null || error === void 0 ? void 0 : error.message,
                    stack: error === null || error === void 0 ? void 0 : error.stack,
                    name: error === null || error === void 0 ? void 0 : error.name,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async submitHSForms(formSubmission) {
        const url = `/submissions/v3/integration/submit/${formSubmission.portalId}/${formSubmission.formId}`;
        const payload = {
            submittedAt: luxon_1.DateTime.now().toMillis(),
            fields: formSubmission.fields,
            context: formSubmission.context,
        };
        const response = await this.httpForms.post(url, payload);
        return response.data;
    }
};
HubspotService = HubspotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('APP_ENVIRONMENT')),
    __param(3, (0, common_1.Inject)('HTTP_HS_FORMS')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        api_client_1.Client, String, axios_1.Axios,
        common_1.Logger])
], HubspotService);
exports.HubspotService = HubspotService;
//# sourceMappingURL=hubspot.service.js.map