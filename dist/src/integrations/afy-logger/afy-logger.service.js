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
Object.defineProperty(exports, "__esModule", { value: true });
exports.trialConversionEvents = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const consts_1 = require("./consts");
const uuid_1 = require("uuid");
exports.trialConversionEvents = {
    BECOME_MEMBER: 'become-member',
    NEW_TRIAL: 'new-trial',
};
let AfyLoggerService = class AfyLoggerService {
    constructor(http) {
        this.http = http;
    }
    async sendLog(data) {
        try {
            await this.http.axiosRef.post('/loggers', data);
        }
        catch (err) {
            console.log('Error sending log to Afy-Logger', err);
        }
    }
    async sendLogTrialConversion(subscription, eventName) {
        await this.sendLog({
            customer: {
                name: `${subscription.customer.first_name} ${subscription.customer.last_name}`.trim(),
                email: subscription.customer.email,
            },
            source: 'digital-services',
            event: {
                namespace: 'trial-conversion',
                name: eventName,
            },
            tags: [
                `day:${consts_1.weekday[new Date().getDay()]}`,
                `subscription:${subscription.product.name}`,
            ],
            trace: (0, uuid_1.v4)(),
        });
    }
};
AfyLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AfyLoggerService);
exports.default = AfyLoggerService;
//# sourceMappingURL=afy-logger.service.js.map