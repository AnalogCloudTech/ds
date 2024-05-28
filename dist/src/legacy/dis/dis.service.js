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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisService = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../../customers/customers/domain/types");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
const hubspot_service_1 = require("./legacy/hubspot/hubspot.service");
const luxon_1 = require("luxon");
const contexts_1 = require("../../internal/common/contexts");
const lodash_1 = require("lodash");
let DisService = class DisService {
    constructor(http, configService, hubspotService, logger) {
        this.http = http;
        this.configService = configService;
        this.hubspotService = hubspotService;
        this.logger = logger;
    }
    async getAutoLoginToken(id) {
        return this.hubspotService.findOrCreateAutoLoginToken(id);
    }
    async authenticateCustomerThroughHubspot(email, password) {
        return this.hubspotService.authenticate(email, password);
    }
    async syncDependencies(dto, loginToken, passwordEncrypted) {
        const hubspotId = await this.syncHubspot(dto, loginToken, passwordEncrypted);
        return {
            hubspotId,
        };
    }
    fixCountry(country) {
        if (country === 'Canada' || country === 'CA') {
            return 'CA';
        }
        return 'US';
    }
    validateAddress(address) {
        return (!(0, lodash_1.isEmpty)(address.address1) &&
            !(0, lodash_1.isEmpty)(address.city) &&
            !(0, lodash_1.isEmpty)(address.state) &&
            !(0, lodash_1.isEmpty)(address.zip) &&
            !(0, lodash_1.isEmpty)(address.country));
    }
    async syncHubspot(dto, loginToken, passwordEncrypted) {
        var _a;
        const isBillingAddressValid = this.validateAddress(dto.billing);
        const hubspotDto = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ email: dto.email, firstname: dto.firstName, lastname: dto.lastName, phone: dto.phone }, (dto.password && { afy_password: dto.password })), (dto.password &&
            passwordEncrypted && { afy_password_encrypted: passwordEncrypted })), { afy_customer_login_token: loginToken }), (isBillingAddressValid && {
            address: [dto.billing.address1, dto.billing.address2]
                .filter((address) => address)
                .join(', '),
            city: dto.billing.city,
            state: dto.billing.state,
            zip: dto.billing.zip,
            country: this.fixCountry(dto.billing.country),
        })), (dto.accountType && {
            account_type: dto.accountType,
        }));
        if (this.configService.get('hubspot.forceCustomerActive')) {
            hubspotDto['afy_customer_status'] = types_1.CustomerStatus.ACTIVE;
        }
        if ((_a = dto === null || dto === void 0 ? void 0 : dto.smsPreferences) === null || _a === void 0 ? void 0 : _a.schedulingCoachReminders) {
            hubspotDto['text_message_opt_in'] = true;
            this.logger.log({
                payload: {
                    message: 'customer has smsPreferences',
                    method: 'HubspotController@createOrUpdateContact',
                    executedBy: { name: 'DIS_SERVICE' },
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        }
        this.logger.log({
            payload: {
                step: 'start',
                message: 'before update',
                method: 'HubspotController@createOrUpdateContact',
                executedBy: { name: 'DIS_SERVICE' },
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        const createOrUpdateContact = await this.hubspotService.createOrUpdateContact(hubspotDto);
        this.logger.log({
            payload: {
                step: 'end',
                message: 'after update',
                method: 'HubspotController@createOrUpdateContact',
                executedBy: { name: 'DIS_SERVICE' },
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        return createOrUpdateContact;
    }
    async getWebinarInfo(webinarCode) {
        const endpoint = `/v1/webinars/${webinarCode}`;
        const response = await this.http.get(endpoint);
        const { data } = response;
        return data;
    }
    async webinarRegistration(webinarCode, start, name, email, smsNumber) {
        const endpoint = `/v1/webinars/${webinarCode}`;
        const payload = {
            start_time: start,
            name,
            email,
            sms_number: smsNumber,
        };
        await this.http.post(endpoint, payload);
    }
    async addCustomerToWorkFlow(contactEmail, workFlowId) {
        const workflowDto = {
            contactEmail,
            workFlowId,
        };
        await this.hubspotService.addContactToWorkFlow(workflowDto);
    }
};
DisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('HTTP_DIS')),
    __metadata("design:paramtypes", [axios_1.Axios,
        config_1.ConfigService,
        hubspot_service_1.HubspotService,
        common_1.Logger])
], DisService);
exports.DisService = DisService;
//# sourceMappingURL=dis.service.js.map