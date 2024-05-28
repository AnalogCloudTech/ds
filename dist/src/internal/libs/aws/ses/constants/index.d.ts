import 'dotenv/config';
export declare const SesProviderName = "AWS_SES";
export declare const SesEmailTemplatePrefix: string;
export declare const SesCustomerEmailTemplatePrefix: string;
export declare const buildTemplateName: (id: number) => string;
export declare const buildCustomerTemplateName: (id: number) => string;
export declare const DefaultCustomVerificationEmailTemplate: string;
