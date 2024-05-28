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
exports.TwilioService = void 0;
const common_1 = require("@nestjs/common");
const twilio_1 = require("twilio");
const constants_1 = require("./constants");
const lodash_1 = require("lodash");
const customers_service_1 = require("../../customers/customers/customers.service");
const replaceTags_1 = require("../../internal/utils/aws/ses/replaceTags");
let TwilioService = class TwilioService {
    constructor(twilio, from, customersService) {
        this.twilio = twilio;
        this.from = from;
        this.customersService = customersService;
    }
    async sendSMS(params) {
        return this.twilio.messages.create(params);
    }
    async handleReply(reply) {
        const option = this.getOption(reply.Body);
        const isAValidOption = typeof this[option] === 'function' && constants_1.possibleOptions.includes(option);
        if (!isAValidOption) {
            return {
                reply,
                reason: 'invalid option',
                status: 'failed',
                option: 'invalidOption',
            };
        }
        return this[option](reply);
    }
    getOption(message) {
        const optionsRegex = /stop reminders/gi;
        const matches = message.match(optionsRegex);
        return (0, lodash_1.isNull)(matches) ? null : (0, lodash_1.camelCase)(matches[0]);
    }
    async stopReminders(reply) {
        const { From: fromNumber } = reply;
        const customer = await this.customersService.unsubscribeSMSRemindersByPhoneNumber(fromNumber);
        return {
            option: 'stopReminders',
            reply,
            status: customer ? 'success' : 'failed',
            reason: !customer ? 'customer not found' : '',
        };
    }
    buildSMSMessageForCustomer(populatedReminder, template) {
        const customer = populatedReminder.customer;
        const coach = populatedReminder.coach;
        const body = (0, replaceTags_1.replaceTags)(template.content, {
            '{{CUSTOMER_NAME}}': customer.firstName,
            '{{COACH_NAME}}': coach.name,
            '{{ZOOM_LINK}}': populatedReminder.meetingLink,
            '{{MEETING_DATE_TIME}}': populatedReminder.meetingDateFormatted,
        });
        const phone = customer === null || customer === void 0 ? void 0 : customer.phone;
        const to = !(0, lodash_1.isNull)(phone === null || phone === void 0 ? void 0 : phone.match(/\+1/)) ? `+1${phone}` : phone;
        return {
            body,
            to,
            from: this.from,
        };
    }
};
TwilioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.TwilioProviderName)),
    __param(1, (0, common_1.Inject)(constants_1.TwilioNumberProvider)),
    __metadata("design:paramtypes", [twilio_1.Twilio, String, customers_service_1.CustomersService])
], TwilioService);
exports.TwilioService = TwilioService;
//# sourceMappingURL=twilio.service.js.map