"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCustomVerificationEmailTemplate = exports.buildCustomerTemplateName = exports.buildTemplateName = exports.SesCustomerEmailTemplatePrefix = exports.SesEmailTemplatePrefix = exports.SesProviderName = void 0;
require("dotenv/config");
const PREFIX = process.env.EMAIL_CAMPAING_ENVIRONMENT || 'dev';
exports.SesProviderName = 'AWS_SES';
exports.SesEmailTemplatePrefix = `${PREFIX}_DS_template-`;
exports.SesCustomerEmailTemplatePrefix = `${PREFIX}_DS_customer-template-`;
const buildTemplateName = (id) => `${exports.SesEmailTemplatePrefix}${id}`;
exports.buildTemplateName = buildTemplateName;
const buildCustomerTemplateName = (id) => `${exports.SesCustomerEmailTemplatePrefix}${id}`;
exports.buildCustomerTemplateName = buildCustomerTemplateName;
exports.DefaultCustomVerificationEmailTemplate = `${PREFIX}_DS_default_custom_verification_email_template`;
//# sourceMappingURL=index.js.map