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
exports.SesService = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const util_1 = require("util");
const constants_1 = require("./constants");
const config_1 = require("@nestjs/config");
const lodash_1 = require("lodash");
const iam_service_1 = require("../iam/iam.service");
const bcryptjs_1 = require("bcryptjs");
const replaceTags_1 = require("../../../utils/aws/ses/replaceTags");
let SesService = class SesService {
    constructor(ses, configService, iamService, logger) {
        this.ses = ses;
        this.configService = configService;
        this.iamService = iamService;
        this.logger = logger;
    }
    async sendSingleEmail(params) {
        return this.ses.sendEmail(params).promise();
    }
    async buildSingleEmailParams(emailReminder) {
        const templateName = (0, constants_1.buildTemplateName)(this.configService.get('reminderTemplate.templateId'));
        const templateData = await this.getTemplateData(templateName);
        const body = (0, lodash_1.get)(templateData, ['Template', 'HtmlPart']);
        const bodyReplaced = (0, replaceTags_1.replaceTags)(body, {
            '{{CUSTOMER_NAME}}': emailReminder.customerName,
            '{{COACH_NAME}}': emailReminder.coachName,
            '{{ZOOM_LINK}}': emailReminder.zoomLink,
            '{{MEETING_DATE_TIME}}': emailReminder.dateTime,
        });
        return {
            Source: emailReminder.coachEmail,
            Destination: {
                ToAddresses: [emailReminder.customerEmail],
                BccAddresses: this.configService.get('aws.ses.bccAddresses.emailReminder'),
            },
            Message: {
                Body: {
                    Html: {
                        Data: bodyReplaced,
                    },
                },
                Subject: {
                    Data: emailReminder.subject,
                },
            },
            ConfigurationSetName: this.configService.get('aws.ses.config.default'),
        };
    }
    async buildEmailReminderParams(emailReminder) {
        try {
            const templateName = (0, constants_1.buildTemplateName)(this.configService.get('reminderTemplate.templateId'));
            const templateData = await this.getTemplateData(templateName);
            const customer = emailReminder.customer;
            const coach = emailReminder.coach;
            const body = (0, lodash_1.get)(templateData, ['Template', 'HtmlPart']);
            const bodyReplaced = (0, replaceTags_1.replaceTags)(body, {
                '{{CUSTOMER_NAME}}': customer.firstName,
                '{{COACH_NAME}}': coach.name,
                '{{ZOOM_LINK}}': emailReminder.meetingLink,
                '{{MEETING_DATE_TIME}}': emailReminder.meetingDateFormatted,
            });
            return {
                Source: (0, lodash_1.get)(coach, 'email'),
                Destination: {
                    ToAddresses: [customer.email],
                    BccAddresses: this.configService.get('aws.ses.bccAddresses.emailReminder'),
                },
                Message: {
                    Body: {
                        Html: {
                            Data: bodyReplaced,
                        },
                    },
                    Subject: {
                        Data: emailReminder.subject,
                    },
                },
                ConfigurationSetName: this.configService.get('aws.ses.config.default'),
            };
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_1.HttpException({ message: err.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    getTemplateData(templateName) {
        const templateRequest = {
            TemplateName: templateName,
        };
        return this.ses.getTemplate(templateRequest).promise();
    }
    async listVerifiedEmailAddresses() {
        return this.ses.listVerifiedEmailAddresses().promise();
    }
    async validateEmail(email) {
        const data = await this.ses.getIdentityVerificationAttributes({
            Identities: [email],
        }).promise();
        return !(0, lodash_1.isEmpty)(data.VerificationAttributes) && data.VerificationAttributes[email].VerificationStatus === 'Success';
    }
    async emailIsVerified(email) {
        return this.validateEmail(email);
    }
    buildParamsFromLeads(source, templateName, leads, attributes) {
        const defaultTemplateData = JSON.stringify({
            LEAD_FIRST_NAME: 'There',
            LEAD_LAST_NAME: '',
            LEAD_EMAIL: '',
            LEAD_UNSUBSCRIBE_URL: '',
            BROKER_ADDRESS: '',
            PROFILE_IMAGE: '',
            MEMBER_FIRST_NAME: '',
            MEMBER_LAST_NAME: '',
            MEMBER_TITLE: '',
            MEMBER_BROKER_NAME: '',
            MEMBER_ADDRESS: '',
            MEMBER_PHONE: '',
            MEMBER_PROFILE_IMAGE: '',
            MEMBER_EMAIL: '',
            MEMBER_BOOK_URL: '',
        });
        const extraAttributes = {
            BROKER_ADDRESS: (0, lodash_1.get)(attributes, 'brokerAddress'),
            PROFILE_IMAGE: (0, lodash_1.get)(attributes, 'imageUrl'),
            MEMBER_FIRST_NAME: (0, lodash_1.get)(attributes, 'memberFirstName'),
            MEMBER_LAST_NAME: (0, lodash_1.get)(attributes, 'memberLastName'),
            MEMBER_TITLE: (0, lodash_1.get)(attributes, 'memberTitle'),
            MEMBER_BROKER_NAME: (0, lodash_1.get)(attributes, 'memberBrokerName'),
            MEMBER_ADDRESS: (0, lodash_1.get)(attributes, 'memberAddress'),
            MEMBER_PHONE: (0, lodash_1.get)(attributes, 'memberPhone'),
            MEMBER_PROFILE_IMAGE: (0, lodash_1.get)(attributes, 'memberProfileImage'),
            MEMBER_EMAIL: (0, lodash_1.get)(attributes, 'memberEmail'),
            MEMBER_BOOK_URL: (0, lodash_1.get)(attributes, 'memberBookUrl'),
        };
        return {
            Source: source,
            Template: templateName,
            Destinations: leads.map((item) => {
                const { email, firstName, lastName } = item;
                const templateData = {
                    LEAD_FIRST_NAME: firstName,
                    LEAD_LAST_NAME: lastName,
                    LEAD_EMAIL: email,
                    LEAD_UNSUBSCRIBE_URL: this.generateRouteForUnsubscribe((0, lodash_1.get)(item, '_id')),
                };
                Object.keys(extraAttributes).forEach((key) => {
                    if (!(0, lodash_1.isEmpty)(extraAttributes[key]) &&
                        !(0, lodash_1.isUndefined)(extraAttributes[key])) {
                        templateData[key] = extraAttributes[key];
                    }
                });
                return {
                    Destination: {
                        ToAddresses: [email],
                    },
                    ReplacementTemplateData: JSON.stringify(templateData),
                };
            }),
            ConfigurationSetName: this.configService.get('aws.ses.config.default'),
            DefaultTemplateData: defaultTemplateData,
        };
    }
    async sendBulkTemplatedEmail(params) {
        return this.ses.sendBulkTemplatedEmail(params).promise();
    }
    async setPolicy(email) {
        const region = this.configService.get('aws.region');
        const arn = await this.iamService.getArn();
        const accountId = this.iamService.getAccountIdFromArn(arn);
        const sid = await this.buildStatementSid(email);
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: sid,
                    Effect: 'Allow',
                    Principal: {
                        AWS: arn,
                    },
                    Action: [
                        'ses:SendEmail',
                        'ses:SendRawEmail',
                        'ses:SendTemplatedEmail',
                        'ses:SendBulkTemplatedEmail',
                    ],
                    Resource: this.buildResourceIdentity(region, accountId, email),
                    Condition: {},
                },
            ],
        };
        const params = {
            Identity: email,
            PolicyName: 'send-mails-policy',
            Policy: JSON.stringify(policy),
        };
        return this.ses.putIdentityPolicy(params).promise();
    }
    async sendVerificationEmail(email) {
        const data = {
            EmailAddress: email,
            TemplateName: constants_1.DefaultCustomVerificationEmailTemplate,
        };
        await this.ses.sendCustomVerificationEmail(data).promise();
        await this.setPolicy(email);
    }
    async createTemplate(name, subject, html) {
        const template = {
            Template: {
                TemplateName: name,
                SubjectPart: subject,
                HtmlPart: html,
            },
        };
        return this.ses
            .createTemplate(template)
            .promise()
            .then(function (result) {
            this.logger.log(`Created template on SES ${(0, util_1.inspect)(result)}`);
        }.bind(this));
    }
    async updateTemplate(name, subject, html) {
        const request = {
            Template: {
                TemplateName: name,
                SubjectPart: subject,
                HtmlPart: html,
            },
        };
        return this.ses
            .updateTemplate(request)
            .promise()
            .then(function (result) {
            this.logger.log(`Updated template on SES ${(0, util_1.inspect)(result)}`);
        }.bind(this));
    }
    async templateDetails(template) {
        const request = {
            TemplateName: template,
        };
        const response = await this.ses.getTemplate(request).promise();
        return response;
    }
    async deleteTemplate(name) {
        const deleteRequest = {
            TemplateName: name,
        };
        return this.ses
            .deleteTemplate(deleteRequest)
            .promise()
            .then(function (result) {
            this.logger.log(`Deleted template from SES ${(0, util_1.inspect)(result)}`);
        }.bind(this));
    }
    async createDefaultCustomVerificationEmailTemplate(dto) {
        const request = {
            TemplateName: constants_1.DefaultCustomVerificationEmailTemplate,
            FromEmailAddress: dto.fromEmail,
            TemplateSubject: dto.subject,
            TemplateContent: dto.content,
            SuccessRedirectionURL: dto.successRedirectUrl,
            FailureRedirectionURL: dto.failureRedirectUrl,
        };
        return this.ses.createCustomVerificationEmailTemplate(request).promise();
    }
    async getCustomVerificationEmailTemplate(name) {
        const request = {
            TemplateName: name,
        };
        try {
            const template = await this.ses
                .getCustomVerificationEmailTemplate(request)
                .promise();
            return template;
        }
        catch (e) {
            throw new common_1.NotFoundException(e);
        }
    }
    async updateDefaultCustomVerificationEmailTemplate(name, dto) {
        const request = {
            TemplateName: name,
            FromEmailAddress: dto.fromEmail,
            TemplateSubject: dto.subject,
            TemplateContent: dto.content,
            SuccessRedirectionURL: dto.successRedirectUrl,
            FailureRedirectionURL: dto.failureRedirectUrl,
        };
        await this.getCustomVerificationEmailTemplate(name);
        return this.ses.updateCustomVerificationEmailTemplate(request).promise();
    }
    generateRouteForUnsubscribe(leadID) {
        return (this.configService.get('aws.ses.unsubscribe').replace(/:id/, leadID));
    }
    buildResourceIdentity(region, accountId, identity) {
        return `arn:aws:ses:${region}:${accountId}:identity/${identity}`;
    }
    async buildStatementSid(sidSource) {
        const hash = await (0, bcryptjs_1.hash)(sidSource, 13);
        return `stmt${hash}`;
    }
};
SesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.SesProviderName)),
    __metadata("design:paramtypes", [aws_sdk_1.SES,
        config_1.ConfigService,
        iam_service_1.IamService,
        common_1.Logger])
], SesService);
exports.SesService = SesService;
//# sourceMappingURL=ses.service.js.map