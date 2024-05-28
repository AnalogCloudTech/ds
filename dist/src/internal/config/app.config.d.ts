export type App = {
    env: string;
    port: number;
};
export type Auth = {
    jwtSecret: string;
    jwtExpiration: string;
    bcryptRounds: number;
};
export type Database = {
    url: string;
};
export type BookApi = {
    key: string;
    url: string;
};
export type FacebookToken = {
    host: string;
    redirectUrl: string;
    grantType: string;
};
export type Dis = {
    key: string;
    url: string;
};
export type Aws = {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    publicBucketName: string;
    reportsBucketName: string;
    ses: {
        config: {
            default: string;
            transactional: string;
            onDemand: string;
            campaign: string;
        };
        unsubscribe: string;
        bccAddresses: {
            emailReminder: Array<string>;
        };
        noreplyEmail: string;
    };
    sns: {
        topics: {
            [key: string]: string;
        };
    };
    msk: {
        kafka: {
            brokers: string;
        };
    };
};
export type SocialMedia = {
    facebook: {
        developerId: string;
        token: string;
    };
};
export type Cms = {
    key: string;
    url: string;
    app_config_chargify_products_list_id: string;
};
export type OldCms = {
    authUrl: string;
    url: string;
    user: string;
    password: string;
};
export type Twilio = {
    accountSid: string;
    authToken: string;
    fromPhoneNumber: string;
};
export type ShippingEasy = {
    apiKey: string;
    subDomain: string;
    apiSecret: string;
};
export type Zoom = {
    key: string;
    url: string;
    proxy: string;
    cronjobEnv: string;
    zoomUrl: string;
    zoomApiKey: string;
    zoomApiSecret: string;
    zoomServerOAuthUrl: string;
    zoomBasicToken: string;
    zoomSecretToken: string;
};
export type Google = {
    key: string;
};
export type Webinar = {
    url: string;
};
export type Stripe = {
    key: string;
};
export type Hubspot = {
    url: string;
    forceCustomerActive: boolean;
    key: string;
    retries: number;
    formsBaseUrl: string;
    ticket: {
        prefix: string;
    };
};
export type ElasticSearch = {
    url: string;
    username: string;
    password: string;
};
export type Logstash = {
    host: string;
    port: number;
    username: string;
    password: string;
    level: string;
};
export type STRAY_DOMAIN_CONSTANTS = {
    HS_PIPELINE_STAGE: string;
    HS_OWNER_ID: string;
    HS_PIPELINE: string;
    HS_DENTIST_GUIDE_PIPELINE: string;
    HS_DENTIST_GUIDE_PIPELINE_STAGE: string;
};
export type Content = {
    calendar: {
        createEvent: {
            title: string;
            description: string;
        };
    };
};
export type TemplateId = {
    templateId: number;
};
export type Redis = {
    host: string;
    port: number;
    username?: string;
    password?: string;
};
export type FeatureFlags = {
    trainingWebinar: boolean;
};
export type Swagger = {
    username: string;
    password: string;
};
export type Sentry = {
    dsn: string;
    sampleRate: string;
    debug: boolean;
    environment: string;
    release: string;
};
export type Logger = {
    pretty: boolean;
    level: string;
};
export type Chargify = {
    sub_domain: string;
    api_key: string;
};
export type FlippingAPI = {
    url: string;
    key: string;
};
export type OnboardSettings = {
    scheduleCoachDuration: number;
};
export type Config = {
    app: App;
    logger: Logger;
    auth: Auth;
    database: Database;
    bookApi: BookApi;
    facebookToken: FacebookToken;
    dis: Dis;
    aws: Aws;
    cms: Cms;
    oldCms: OldCms;
    twilio: Twilio;
    shippingEasy: ShippingEasy;
    socialMedia: SocialMedia;
    swagger: Swagger;
    zoom: Zoom;
    google: Google;
    webinar: Webinar;
    stripe: Stripe;
    hubspot: Hubspot;
    elasticSearch: ElasticSearch;
    logstash: Logstash;
    strayDomainConstants: STRAY_DOMAIN_CONSTANTS;
    sendToPrintConstants: STRAY_DOMAIN_CONSTANTS;
    content: Content;
    redis: Redis;
    features: FeatureFlags;
    reminderTemplate: TemplateId;
    csvExportTemplate: TemplateId;
    upsellReportExportTemplate: TemplateId;
    sentry: Sentry;
    chargify: Chargify;
    flippingAPI: FlippingAPI;
    onboardSettings: OnboardSettings;
    afyLogger: {
        url: string;
    };
};
declare const _default: () => Config;
export default _default;
