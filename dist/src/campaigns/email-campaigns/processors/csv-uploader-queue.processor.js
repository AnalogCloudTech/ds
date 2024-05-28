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
exports.CsvUploaderQueueProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../constants");
const functions_1 = require("../../../internal/utils/functions");
const s3_service_1 = require("../../../internal/libs/aws/s3/s3.service");
const constants_2 = require("../../../internal/libs/aws/ses/constants");
const config_1 = require("@nestjs/config");
const ses_service_1 = require("../../../internal/libs/aws/ses/ses.service");
const lodash_1 = require("lodash");
const replaceTags_1 = require("../../../internal/utils/aws/ses/replaceTags");
const string_1 = require("../../../internal/utils/string");
let CsvUploaderQueueProcessor = class CsvUploaderQueueProcessor {
    constructor(s3Service, configService, sesService) {
        this.s3Service = s3Service;
        this.configService = configService;
        this.sesService = sesService;
    }
    async handleJob(job) {
        try {
            const formattedData = job.data.formattedData;
            const customer = job.data.customer;
            const recipientEmail = job.data.email || customer.email;
            const bucket = job.data.bucket;
            const linksPromise = formattedData.map(async (data) => {
                const path = `csv`;
                if (data.data.length === 0)
                    return '';
                await (0, functions_1.sleep)(5000);
                return await this.s3Service.uploadCsv(path, data.data, bucket);
            });
            const links = await Promise.all(linksPromise);
            const download_links = links
                .filter((link) => link !== '')
                .map((link, index) => `<p><a href='${link}' style='color: #1890FF; text-decoration: none;'>CSV File ${index + 1}</a></p>`)
                .join('');
            const templateName = (0, constants_2.buildTemplateName)(this.configService.get('csvExportTemplate.templateId'));
            const noreplyEmail = this.configService.get('aws.ses.noreplyEmail');
            const templateData = await this.sesService.getTemplateData(templateName);
            const body = (0, lodash_1.get)(templateData, ['Template', 'HtmlPart']);
            const bodyReplaced = (0, replaceTags_1.replaceTags)(body, {
                '{{CUSTOMER_NAME}}': (0, string_1.capitalizeFirstLetter)(customer.firstName),
                '{{DOWNLOAD_LINKS}}': download_links,
            });
            const params = {
                Source: noreplyEmail,
                Destination: {
                    ToAddresses: [recipientEmail],
                },
                Message: {
                    Body: {
                        Html: {
                            Data: bodyReplaced,
                        },
                    },
                    Subject: {
                        Data: 'Your campaign data is ready for download',
                    },
                },
                ConfigurationSetName: this.configService.get('aws.ses.config.default'),
            };
            await this.sesService.sendSingleEmail(params);
            await (0, functions_1.sleep)(15000);
        }
        catch (error) {
            throw new Error("Couldn't upload CSV files to S3 and send emails to customers: " +
                error);
        }
    }
};
__decorate([
    (0, bull_1.Process)({ concurrency: 1 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CsvUploaderQueueProcessor.prototype, "handleJob", null);
CsvUploaderQueueProcessor = __decorate([
    (0, bull_1.Processor)(constants_1.CSV_UPLOADER_QUEUE),
    __metadata("design:paramtypes", [s3_service_1.S3Service,
        config_1.ConfigService,
        ses_service_1.SesService])
], CsvUploaderQueueProcessor);
exports.CsvUploaderQueueProcessor = CsvUploaderQueueProcessor;
//# sourceMappingURL=csv-uploader-queue.processor.js.map