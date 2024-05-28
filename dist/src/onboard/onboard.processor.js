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
exports.CoachingDetailsProcessor = exports.OnboardProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const ses_service_1 = require("../internal/libs/aws/ses/ses.service");
const constants_1 = require("./constants");
const onboard_service_1 = require("./onboard.service");
let OnboardProcessor = class OnboardProcessor {
    constructor(sesService) {
        this.sesService = sesService;
    }
    async handleSendMail(job) {
        const emailReminder = job.data;
        const params = await this.sesService.buildSingleEmailParams(emailReminder);
        const sendSingleEmail = await this.sesService.sendSingleEmail(params);
        return sendSingleEmail.MessageId;
    }
};
__decorate([
    (0, bull_1.Process)(constants_1.COACHING_REMINDER_EMAIL_PROCESSOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardProcessor.prototype, "handleSendMail", null);
OnboardProcessor = __decorate([
    (0, bull_1.Processor)(constants_1.COACHING_REMINDER_EMAIL_NAME),
    __metadata("design:paramtypes", [ses_service_1.SesService])
], OnboardProcessor);
exports.OnboardProcessor = OnboardProcessor;
let CoachingDetailsProcessor = class CoachingDetailsProcessor {
    constructor(onboardService) {
        this.onboardService = onboardService;
    }
    async handleJob(job) {
        const email = job.data.email;
        await this.onboardService.updateDealWithCoachDetails(email);
        return true;
    }
};
__decorate([
    (0, bull_1.Process)({ concurrency: 1 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoachingDetailsProcessor.prototype, "handleJob", null);
CoachingDetailsProcessor = __decorate([
    (0, bull_1.Processor)(constants_1.DEALS_COACHING_DETAILS_PROCESSOR),
    __metadata("design:paramtypes", [onboard_service_1.OnboardService])
], CoachingDetailsProcessor);
exports.CoachingDetailsProcessor = CoachingDetailsProcessor;
//# sourceMappingURL=onboard.processor.js.map