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
exports.AfyNotificationsService = void 0;
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const luxon_1 = require("luxon");
const contexts_1 = require("../../internal/common/contexts");
const check_status_of_email_message_exception_1 = require("./exceptions/check-status-of-email-message.exception");
const AFY_NOTIFICATIONS_TOPICS = {
    REGISTER_RECEIVERS: 'notifications.emails.email-address.create',
    CREATE_EMAIL_MESSAGE: 'notifications.emails.email-message.create',
    EMAIL_METRICS: 'notifications.events.metrics',
    STATUS: 'notifications.emails.email-message.status',
};
let AfyNotificationsService = class AfyNotificationsService {
    constructor(clientKafka, logger) {
        this.clientKafka = clientKafka;
        this.logger = logger;
    }
    async onModuleInit() {
        [
            AFY_NOTIFICATIONS_TOPICS.CREATE_EMAIL_MESSAGE,
            AFY_NOTIFICATIONS_TOPICS.EMAIL_METRICS,
            AFY_NOTIFICATIONS_TOPICS.STATUS,
        ].forEach((topic) => {
            this.clientKafka.subscribeToResponseOf(topic);
        });
        await this.clientKafka.connect();
    }
    async sendEmail(emailMessages) {
        const promises = emailMessages.map(async (data) => {
            return (0, rxjs_1.lastValueFrom)(this.clientKafka.send(AFY_NOTIFICATIONS_TOPICS.CREATE_EMAIL_MESSAGE, data));
        });
        return Promise.all(promises);
    }
    async getEmailMetrics(ids, start, end) {
        return (0, rxjs_1.lastValueFrom)(this.clientKafka.send(AFY_NOTIFICATIONS_TOPICS.EMAIL_METRICS, {
            ids,
            start,
            end,
        }));
    }
    async checkStatusOf(messageIds, mode = 'any') {
        try {
            return (0, rxjs_1.lastValueFrom)(this.clientKafka.send(AFY_NOTIFICATIONS_TOPICS.STATUS, {
                ids: messageIds,
                mode,
            }));
        }
        catch (error) {
            if (error instanceof Error) {
                const { name, stack, message } = error;
                this.logger.error({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        name,
                        stack,
                        message,
                    },
                }, stack, contexts_1.CONTEXT_AFY_NOTIFICATIONS);
            }
            throw new check_status_of_email_message_exception_1.CheckStatusOfEmailMessageException();
        }
    }
};
AfyNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('KAFKA_CLIENT')),
    __metadata("design:paramtypes", [microservices_1.ClientKafka,
        common_1.Logger])
], AfyNotificationsService);
exports.AfyNotificationsService = AfyNotificationsService;
//# sourceMappingURL=afy-notifications.service.js.map