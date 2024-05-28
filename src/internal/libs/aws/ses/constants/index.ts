import 'dotenv/config';

const PREFIX = process.env.EMAIL_CAMPAING_ENVIRONMENT || 'dev';

export const SesProviderName = 'AWS_SES';

// TODO: refactor to not use process.env instead use config module
export const SesEmailTemplatePrefix = `${PREFIX}_DS_template-`;
export const SesCustomerEmailTemplatePrefix = `${PREFIX}_DS_customer-template-`;

export const buildTemplateName = (id: number): string =>
  `${SesEmailTemplatePrefix}${id}`;

export const buildCustomerTemplateName = (id: number): string =>
  `${SesCustomerEmailTemplatePrefix}${id}`;

export const DefaultCustomVerificationEmailTemplate = `${PREFIX}_DS_default_custom_verification_email_template`;
