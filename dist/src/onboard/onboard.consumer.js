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
exports.OnboardConsumer = void 0;
const bull_1 = require("@nestjs/bull");
const luxon_1 = require("luxon");
const common_1 = require("@nestjs/common");
const contexts_1 = require("../internal/common/contexts");
const constants_1 = require("./constants");
const onboard_service_1 = require("./onboard.service");
let OnboardConsumer = class OnboardConsumer {
    constructor(service, logger) {
        this.service = service;
        this.logger = logger;
    }
    buildPayload(emailReminder) {
        return Object.assign(Object.assign({}, emailReminder), { usageDate: luxon_1.DateTime.now() });
    }
    async sendToES(payload) {
        return this.logger.log({ payload }, contexts_1.CONTEXT_ON_BOARD_EMAIL);
    }
    async onCompleted(job) {
        const emailReminder = job.data;
        const payload = this.buildPayload(emailReminder);
        return this.sendToES(payload);
    }
};
__decorate([
    (0, bull_1.OnQueueCompleted)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardConsumer.prototype, "onCompleted", null);
OnboardConsumer = __decorate([
    (0, bull_1.Processor)(constants_1.COACHING_REMINDER_EMAIL_NAME),
    __metadata("design:paramtypes", [onboard_service_1.OnboardService,
        common_1.Logger])
], OnboardConsumer);
exports.OnboardConsumer = OnboardConsumer;
//# sourceMappingURL=onboard.consumer.js.map