"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
exports.default = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58;
    const defaultToNumber = (value, defaultValue) => {
        const tryValue = Number(value);
        return isNaN(tryValue) ? defaultValue : tryValue;
    };
    const valueToArray = (value, separator = ';') => {
        const arrayValues = value
            .split(separator)
            .map((item) => item.trim())
            .filter((item) => (0, class_validator_1.isNotEmpty)(item));
        return arrayValues.length ? arrayValues : null;
    };
    const isProd = process.env.NODE_ENV === 'production';
    const port = defaultToNumber(process.env.PORT, 3000);
    const disUrl = (_a = process.env.DIS_URL) !== null && _a !== void 0 ? _a : `http://localhost:${port}`;
    return {
        app: {
            env: (_b = process.env.NODE_ENV) !== null && _b !== void 0 ? _b : 'development',
            port,
        },
        logger: {
            pretty: process.env.LOGGER_PRETTY === 'true' ? true : false,
            level: (_c = process.env.LOGGER_LEVEL) !== null && _c !== void 0 ? _c : 'info',
        },
        sentry: {
            dsn: (_d = process.env.SENTRY_DSN) !== null && _d !== void 0 ? _d : '',
            sampleRate: (_e = process.env.SENTRY_SAMPLE_RATE) !== null && _e !== void 0 ? _e : '1',
            debug: process.env.SENTRY_DEBUG === 'true' ? true : false,
            environment: (_f = process.env.SENTRY_ENVIRONMENT) !== null && _f !== void 0 ? _f : 'production',
            release: (_g = process.env.SENTRY_RELEASE) !== null && _g !== void 0 ? _g : 'unknown',
        },
        auth: {
            jwtSecret: (_h = process.env.JWT_SECRET) !== null && _h !== void 0 ? _h : 'Extremely Unsafe Secret',
            jwtExpiration: (_j = process.env.JWT_EXPIRATION) !== null && _j !== void 0 ? _j : '2 days',
            bcryptRounds: defaultToNumber(process.env.BCRYPT_ROUNDS, 10),
        },
        database: {
            url: (_k = process.env.DATABASE_URI) !== null && _k !== void 0 ? _k : 'mongodb://localhost/digitalServices',
        },
        bookApi: {
            key: (_l = process.env.BOOK_KEY) !== null && _l !== void 0 ? _l : 'c4f7d8b2-7dd2-41e1-8302-59cf92c6107c',
            url: (_m = process.env.BOOK_URL) !== null && _m !== void 0 ? _m : 'http://localhost:9001',
        },
        facebookToken: {
            host: (_o = process.env.FACEBOOK_TOKEN_HOST) !== null && _o !== void 0 ? _o : 'https://graph.facebook.com/v13.0/oauth/access_token',
            redirectUrl: 'https://app.authorify.com',
            grantType: 'fb_exchange_token',
        },
        dis: {
            key: (_p = process.env.DIS_KEY) !== null && _p !== void 0 ? _p : 'Please set DIS_KEY',
            url: disUrl,
        },
        aws: {
            accessKeyId: (_q = process.env.AWS_ACCESS_KEY_ID) !== null && _q !== void 0 ? _q : 'Please set AWS_ACCESS_KEY_ID',
            secretAccessKey: (_r = process.env.AWS_SECRET_ACCESS_KEY) !== null && _r !== void 0 ? _r : 'Please set AWS_SECRET_ACCESS_KEY',
            region: (_s = process.env.AWS_REGION) !== null && _s !== void 0 ? _s : 'us-east-1',
            publicBucketName: (_t = process.env.AWS_PUBLIC_BUCKET_NAME) !== null && _t !== void 0 ? _t : 'afy-users-files',
            reportsBucketName: (_u = process.env.UPSELL_BUCKET) !== null && _u !== void 0 ? _u : 'stg-upsell-reports',
            ses: {
                unsubscribe: (_v = process.env.AWS_SES_UNSUBSCRIBE) !== null && _v !== void 0 ? _v : 'http://localhost:4000/v1/email-campaigns/leads/:id/unsubscribe',
                config: {
                    default: (_w = process.env.AWS_SES_CONFIG_DEFAULT) !== null && _w !== void 0 ? _w : 'stg-digital-services-default',
                    campaign: (_x = process.env.AWS_SES_CONFIG_CAMPAIGN) !== null && _x !== void 0 ? _x : 'stg-notifications-email-campaign',
                    onDemand: (_y = process.env.AWS_SES_CONFIG_ON_DEMAND) !== null && _y !== void 0 ? _y : 'stg-notifications-on-demand',
                    transactional: (_z = process.env.AWS_SES_CONFIG_TRANSACTIONAL) !== null && _z !== void 0 ? _z : 'stg-digital-services-authorify-transactional',
                },
                bccAddresses: {
                    emailReminder: valueToArray((_0 = process.env.AWS_SES_BCC_EMAIL_REMINDERS) !== null && _0 !== void 0 ? _0 : 'it@authorify.com'),
                },
                noreplyEmail: (_1 = process.env.NOREPLY_EMAIL) !== null && _1 !== void 0 ? _1 : 'noreply@authorify.com',
            },
            sns: {
                topics: {
                    RM_MAGAZINE_GENERATION: (_2 = process.env.AWS_SNS_TOPICS_RM_MAGAZINE_GENERATION) !== null && _2 !== void 0 ? _2 : 'RM_MAGAZINE_GENERATION',
                    RM_MAGAZINE_GENERATION_COVERS_FOR_LEAD: (_3 = process.env.AWS_SNS_TOPICS_RM_MAGAZINE_COVERS_GENERATION_FOR_LEAD) !== null && _3 !== void 0 ? _3 : 'RM_MAGAZINE_COVERS_GENERATION_FOR_LEAD',
                },
            },
            msk: {
                kafka: {
                    brokers: (_4 = process.env.AWS_MSK_KAFKA_BROKERS) !== null && _4 !== void 0 ? _4 : 'localhost:9092',
                },
            },
        },
        reminderTemplate: {
            templateId: defaultToNumber(process.env.ONBOARD_COACHING_REMINDER_TEMPLATE, 0),
        },
        csvExportTemplate: {
            templateId: defaultToNumber(process.env.EC_ANALYTICS_EXPORT_TEMPLATE, 0),
        },
        upsellReportExportTemplate: {
            templateId: defaultToNumber(process.env.UPSELL_REPORT_EXPORT_TEMPLATE, 0),
        },
        socialMedia: {
            facebook: {
                developerId: (_5 = process.env.FACEBOOK_DEVELOPER_ID) !== null && _5 !== void 0 ? _5 : '100781399274196',
                token: (_6 = process.env.FACEBOOK_TOKEN) !== null && _6 !== void 0 ? _6 : 'EAAERkkisXZBIBAJjXpXKXFPcqMyO8aEzu3UK88AhHQ4L6GDFwqHVg17NqcYFmZCxPIbV8dgZAMXYTtNgXB8vMBhKeeZB6X0FZAi9o5w4BExWD0f0glPSQcd1xRvGclMEWhOnOtqvCDnp9rZCsgtFBnGKQwN7POiZBwPa1ZBf0CngRWHwLQaEJA8u4pOxqoPeWuCl7FrWpjBGZCtevZAhqlzyez',
            },
        },
        swagger: {
            username: (_7 = process.env.SWAGGER_USERNAME) !== null && _7 !== void 0 ? _7 : 'authorify',
            password: (_8 = process.env.SWAGGER_PASSWORD) !== null && _8 !== void 0 ? _8 : 'AutH0r!fY',
        },
        cms: {
            key: (_9 = process.env.CMS_KEY) !== null && _9 !== void 0 ? _9 : 'Please set CMS_KEY',
            url: (_10 = process.env.CMS_URL) !== null && _10 !== void 0 ? _10 : 'http://localhost:1337/api',
            app_config_chargify_products_list_id: process.env.APP_CONFIG_CHARGIFY_PRODUCTS_LIST_ID,
        },
        oldCms: {
            authUrl: (_11 = process.env.OLD_CMS_AUTH_URL) !== null && _11 !== void 0 ? _11 : 'https://cms.dev.authorify.com/auth/local',
            url: (_12 = process.env.OLD_CMS_URL) !== null && _12 !== void 0 ? _12 : 'https://cms.dev.authorify.com',
            user: (_13 = process.env.OLD_CMS_USER) !== null && _13 !== void 0 ? _13 : 'user',
            password: (_14 = process.env.OLD_CMS_PASSWORD) !== null && _14 !== void 0 ? _14 : 'password',
        },
        twilio: {
            accountSid: (_15 = process.env.TWILIO_ACCOUNT_SID) !== null && _15 !== void 0 ? _15 : 'Please provide twilio account sid',
            authToken: (_16 = process.env.TWILIO_AUTH_TOKEN) !== null && _16 !== void 0 ? _16 : 'Please provide twilio auth token',
            fromPhoneNumber: (_17 = process.env.TWILIO_FROM_PHONE_NUMBER) !== null && _17 !== void 0 ? _17 : 'Please provide twilio from phone number',
        },
        shippingEasy: {
            subDomain: (_18 = process.env.SHIPPING_BASE_URL) !== null && _18 !== void 0 ? _18 : 'https://app.shippingeasy.com/api/',
            apiKey: (_19 = process.env.SHIPPING_API_KEY) !== null && _19 !== void 0 ? _19 : 'Please provide shipping easy api key',
            apiSecret: (_20 = process.env.SHIPPING_API_SECRET) !== null && _20 !== void 0 ? _20 : 'Please provide shipping easy api key',
        },
        zoom: {
            key: (_21 = process.env.ZOOM_JWT_TOKEN) !== null && _21 !== void 0 ? _21 : 'Please set ZOOM_JWT_TOKEN',
            url: (_22 = process.env.ZOOM_API_ENDPOINT) !== null && _22 !== void 0 ? _22 : 'https://zoom.us',
            proxy: (_23 = process.env.ZOOM_PROXY_URL) !== null && _23 !== void 0 ? _23 : 'https://zoom.us/v2/phone/recording/download/',
            zoomUrl: (_24 = process.env.ZOOM_API_URL) !== null && _24 !== void 0 ? _24 : 'https://api.zoom.us/v2/',
            cronjobEnv: (_25 = process.env.CRONJOB_ENV) !== null && _25 !== void 0 ? _25 : 'production',
            zoomApiKey: (_26 = process.env.ZOOM_API_KEY) !== null && _26 !== void 0 ? _26 : 'Please set ZOOM_API_KEY',
            zoomApiSecret: (_27 = process.env.ZOOM_API_SECRET) !== null && _27 !== void 0 ? _27 : 'Please set ZOOM_API_SECRET',
            zoomServerOAuthUrl: (_28 = process.env.ZOOM_SERVER_O_URL) !== null && _28 !== void 0 ? _28 : 'Please set ZOOM_SERVER_O_URL',
            zoomBasicToken: (_29 = process.env.ZOOM_BASIC_TOKEN) !== null && _29 !== void 0 ? _29 : 'Please set ZOOM_BASIC_TOKEN',
            zoomSecretToken: (_30 = process.env.ZOOM_SECRET_TOKEN) !== null && _30 !== void 0 ? _30 : 'Please set ZOOM_SECRET_TOKEN',
        },
        google: {
            key: (_31 = process.env.GOOGLE_CREDENTIALS) !== null && _31 !== void 0 ? _31 : 'Please set GOOGLE_CREDENTIALS',
        },
        webinar: {
            url: (_32 = process.env.WEBINAR_API_URL) !== null && _32 !== void 0 ? _32 : 'https://api.joinnow.live',
        },
        stripe: {
            key: (_33 = process.env.STRIPE_SECRET_KEY) !== null && _33 !== void 0 ? _33 : 'Please set STRIPE_SECRET_KEY',
        },
        hubspot: {
            url: (_34 = process.env.HUBSPOT_API_ENDPOINT) !== null && _34 !== void 0 ? _34 : 'https://api.hubapi.com',
            key: (_35 = process.env.HUBSPOT_API_KEY) !== null && _35 !== void 0 ? _35 : 'Please set HUBSPOT_API_KEY',
            retries: defaultToNumber(process.env.HUBSPOT_API_RETRIES, 5),
            formsBaseUrl: (_36 = process.env.HUBSPOT_FORMS_BASE_URL) !== null && _36 !== void 0 ? _36 : 'https://api.hsforms.com',
            forceCustomerActive: process.env.HUBSPOT_FORCE_CUSTOMER_ACTIVE === 'true',
            ticket: {
                prefix: process.env.HUBSPOT_TICKET_PREFIX === 'production'
                    ? ''
                    : process.env.HUBSPOT_TICKET_PREFIX,
            },
        },
        elasticSearch: {
            url: (_37 = process.env.ELASTIC_URL) !== null && _37 !== void 0 ? _37 : 'http://localhost:9200',
            username: (_38 = process.env.ELASTIC_USERNAME) !== null && _38 !== void 0 ? _38 : 'Please set ELASTIC_USERNAME',
            password: (_39 = process.env.ELASTIC_PASSWORD) !== null && _39 !== void 0 ? _39 : 'Please set ELASTIC_PASSWORD',
        },
        logstash: {
            host: process.env.LOGSTASH_HOST,
            port: defaultToNumber(process.env.LOGSTASH_PORT, undefined),
            username: process.env.LOGSTASH_USERNAME,
            password: process.env.LOGSTASH_PASSWORD,
            level: (_40 = process.env.LOGSTASH_LEVEL) !== null && _40 !== void 0 ? _40 : 'info',
        },
        strayDomainConstants: {
            HS_OWNER_ID: (_41 = process.env.HS_OWNER_ID) !== null && _41 !== void 0 ? _41 : '45336631',
            HS_PIPELINE: (_42 = process.env.HS_PIPELINE) !== null && _42 !== void 0 ? _42 : '10880762',
            HS_PIPELINE_STAGE: (_43 = process.env.HS_PIPELINE_STAGE) !== null && _43 !== void 0 ? _43 : '10880763',
            HS_DENTIST_GUIDE_PIPELINE: (_44 = process.env.HS_DENTIST_GUIDE_PIPELINE) !== null && _44 !== void 0 ? _44 : '67410305',
            HS_DENTIST_GUIDE_PIPELINE_STAGE: (_45 = process.env.HS_DENTIST_GUIDE_PIPELINE_STAGE) !== null && _45 !== void 0 ? _45 : '131209571',
        },
        sendToPrintConstants: {
            HS_OWNER_ID: (_46 = process.env.HS_OWNER_ID) !== null && _46 !== void 0 ? _46 : '48014082',
            HS_PIPELINE: (_47 = process.env.HS_PRINT_QUEUE_PIPELINE) !== null && _47 !== void 0 ? _47 : '4948770',
            HS_PIPELINE_STAGE: (_48 = process.env.HS_PRINT_QUEUE_PIPELINE_STAGE) !== null && _48 !== void 0 ? _48 : '4948771',
            HS_DENTIST_GUIDE_PIPELINE: (_49 = process.env.HS_DENTIST_GUIDE_PIPELINE) !== null && _49 !== void 0 ? _49 : '67410305',
            HS_DENTIST_GUIDE_PIPELINE_STAGE: (_50 = process.env.HS_DENTIST_GUIDE_PIPELINE_STAGE) !== null && _50 !== void 0 ? _50 : '131209571',
        },
        content: {
            calendar: {
                createEvent: {
                    title: `${isProd ? '' : 'DEVELOPMENT TESTING '}{{FIRST_NAME}}, your Authorify coaching call has been confirmed!`,
                    description: `${isProd ? '' : 'DEVELOPMENT TESTING '}Congratulations! You are scheduled for an introduction call to learn how to grow your business with a unique branding strategy.

          You'll just need to click on the zoom link from this invite and be in front of your computer for the call.

          I'll be sharing my screen for part of the session reviewing some strategies we have for Authorify members and how we can help you scale your business.I'm excited to learn more about you and how Authorify can help grow your business.`,
                },
            },
        },
        redis: {
            host: (_51 = process.env.REDIS_HOST) !== null && _51 !== void 0 ? _51 : 'localhost',
            port: defaultToNumber(process.env.REDIS_PORT, 6379),
            username: (_52 = process.env.REDIS_USERNAME) !== null && _52 !== void 0 ? _52 : '',
            password: (_53 = process.env.REDIS_PASSWORD) !== null && _53 !== void 0 ? _53 : '',
        },
        features: {
            trainingWebinar: process.env.FEATURE_TRAINING_WEBINAR === '1',
        },
        chargify: {
            sub_domain: (_54 = process.env.CHARGIFY_SUB_DOMAIN) !== null && _54 !== void 0 ? _54 : 'https://authorify-dev.chargify.com',
            api_key: (_55 = process.env.CHARGIFY_API_KEY) !== null && _55 !== void 0 ? _55 : '',
        },
        flippingAPI: {
            key: (_56 = process.env.FLIPPING_API_KEY) !== null && _56 !== void 0 ? _56 : 'no-key',
            url: (_57 = process.env.FLIPPING_API_URL) !== null && _57 !== void 0 ? _57 : 'no-url',
        },
        onboardSettings: {
            scheduleCoachDuration: defaultToNumber(process.env.ONBOARD_SCHEDULE_COACH_DURATION, 30),
        },
        afyLogger: {
            url: (_58 = process.env.AFY_LOGGER_URL) !== null && _58 !== void 0 ? _58 : '',
        },
    };
};
//# sourceMappingURL=app.config.js.map