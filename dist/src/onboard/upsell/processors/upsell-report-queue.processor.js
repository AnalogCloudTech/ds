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
exports.UpsellReportQueueProcessor = void 0;
const constant_1 = require("../constant");
const bull_1 = require("@nestjs/bull");
const s3_service_1 = require("../../../internal/libs/aws/s3/s3.service");
const config_1 = require("@nestjs/config");
const ses_service_1 = require("../../../internal/libs/aws/ses/ses.service");
const lodash_1 = require("lodash");
const functions_1 = require("../../../internal/utils/functions");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../internal/common/contexts");
const common_1 = require("@nestjs/common");
let UpsellReportQueueProcessor = class UpsellReportQueueProcessor {
    constructor(s3Service, configService, sesService, logger) {
        this.s3Service = s3Service;
        this.configService = configService;
        this.sesService = sesService;
        this.logger = logger;
    }
    async handleJob(job) {
        try {
            const formattedData = job.data.formattedData;
            const recipientEmail = job.data.email;
            if ((0, lodash_1.isEmpty)(formattedData) || !recipientEmail) {
                this.logger.log({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        method: 'UpsellReportQueueProcessor.handleJob',
                        message: `formattedData or recipientEmail is missing`,
                    },
                }, contexts_1.CONTEXT_SEND_UPSELL_REPORT_PROCESSOR);
            }
            const link = await this.s3Service.uploadCsv('csv', formattedData, this.configService.get('aws.reportsBucketName'));
            const htmlLink = `<p>Your Upsell Report is Ready: <a href='${link}' style='color: #1890FF; text-decoration: none;'>DOWNLOAD NOW.</a></p>`;
            const noreplyEmail = this.configService.get('aws.ses.noreplyEmail');
            const params = {
                Source: noreplyEmail,
                Destination: {
                    ToAddresses: [recipientEmail],
                },
                Message: {
                    Body: {
                        Html: {
                            Data: htmlLink,
                        },
                    },
                    Subject: {
                        Data: 'Upsell report data is ready for download',
                    },
                },
                ConfigurationSetName: this.configService.get('aws.ses.config.default'),
            };
            await this.sesService.sendSingleEmail(params);
            await (0, functions_1.sleep)(15000);
            return true;
        }
        catch (error) {
            this.logger.error({
                payload: {
                    usageDate: luxon_1.DateTime.now(),
                    message: `Couldn't upload CSV files to S3 and send email to admin:  ${error}`,
                },
            }, contexts_1.CONTEXT_SEND_UPSELL_REPORT_PROCESSOR);
            return false;
        }
    }
    onFailed(job, error) {
        this.logger.error({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                method: 'UpsellReportQueueProcessor.onFailed',
                message: error,
            },
        }, contexts_1.CONTEXT_SEND_UPSELL_REPORT_PROCESSOR);
    }
};
__decorate([
    (0, bull_1.Process)({ concurrency: 1 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UpsellReportQueueProcessor.prototype, "handleJob", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], UpsellReportQueueProcessor.prototype, "onFailed", null);
UpsellReportQueueProcessor = __decorate([
    (0, bull_1.Processor)(constant_1.UPSELL_REPORT_QUEUE),
    __metadata("design:paramtypes", [s3_service_1.S3Service,
        config_1.ConfigService,
        ses_service_1.SesService,
        common_1.Logger])
], UpsellReportQueueProcessor);
exports.UpsellReportQueueProcessor = UpsellReportQueueProcessor;
//# sourceMappingURL=upsell-report-queue.processor.js.map