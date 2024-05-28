import { isNotEmpty } from 'class-validator';

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
  hubspotQuoteTemplate: TemplateId;
  upsellReportExportTemplate: TemplateId;
  sentry: Sentry;
  chargify: Chargify;
  flippingAPI: FlippingAPI;
  onboardSettings: OnboardSettings;
  afyLogger: {
    url: string;
  };
  quotes: {
    hs_esign_enabled: string;
    hs_terms: string;
    hs_domain: string;
    hs_currency: string;
    hs_sender_company_name: string;
    hs_sender_company_address: string;
    hs_sender_company_city: string;
    hs_sender_company_zip: string;
    hs_sender_company_state: string;
    hs_sender_company_country: string;
  };
  quoteTemplate: string;
  allowedLineItemsId: Array<string>;
};

export default (): Config => {
  const defaultToNumber = (value: any, defaultValue: number): number => {
    const tryValue = Number(value);
    return isNaN(tryValue) ? defaultValue : tryValue;
  };

  const valueToArray = (
    value: string,
    separator = ';',
  ): Array<string> | null => {
    const arrayValues = value
      .split(separator)
      .map((item) => item.trim())
      .filter((item) => isNotEmpty(item));
    return arrayValues.length ? arrayValues : null;
  };

  const isProd = process.env.NODE_ENV === 'production';
  const port = defaultToNumber(process.env.PORT, 3000);
  const disUrl = process.env.DIS_URL ?? `http://localhost:${port}`;

  return {
    app: {
      env: process.env.NODE_ENV ?? 'development',
      port,
    },
    logger: {
      pretty: process.env.LOGGER_PRETTY === 'true' ? true : false,
      level: process.env.LOGGER_LEVEL ?? 'info',
    },
    sentry: {
      dsn: process.env.SENTRY_DSN ?? '',
      sampleRate: process.env.SENTRY_SAMPLE_RATE ?? '1',
      debug: process.env.SENTRY_DEBUG === 'true' ? true : false,
      environment: process.env.SENTRY_ENVIRONMENT ?? 'production',
      release: process.env.SENTRY_RELEASE ?? 'unknown',
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET ?? 'Extremely Unsafe Secret',
      jwtExpiration: process.env.JWT_EXPIRATION ?? '2 days',
      bcryptRounds: defaultToNumber(process.env.BCRYPT_ROUNDS, 10),
    },
    database: {
      url: process.env.DATABASE_URI ?? 'mongodb://localhost/digitalServices',
    },
    bookApi: {
      key: process.env.BOOK_KEY ?? 'c4f7d8b2-7dd2-41e1-8302-59cf92c6107c',
      url: process.env.BOOK_URL ?? 'http://localhost:9001',
    },
    facebookToken: {
      host:
        process.env.FACEBOOK_TOKEN_HOST ??
        'https://graph.facebook.com/v13.0/oauth/access_token',
      redirectUrl: 'https://app.authorify.com',
      grantType: 'fb_exchange_token',
    },
    dis: {
      key: process.env.DIS_KEY ?? 'Please set DIS_KEY',
      url: disUrl,
    },
    aws: {
      accessKeyId:
        process.env.AWS_ACCESS_KEY_ID ?? 'Please set AWS_ACCESS_KEY_ID',
      secretAccessKey:
        process.env.AWS_SECRET_ACCESS_KEY ?? 'Please set AWS_SECRET_ACCESS_KEY',
      region: process.env.AWS_REGION ?? 'us-east-1',
      publicBucketName: process.env.AWS_PUBLIC_BUCKET_NAME ?? 'afy-users-files',
      reportsBucketName: process.env.UPSELL_BUCKET ?? 'stg-upsell-reports',
      ses: {
        unsubscribe:
          process.env.AWS_SES_UNSUBSCRIBE ??
          'http://localhost:4000/v1/email-campaigns/leads/:id/unsubscribe',
        config: {
          default:
            process.env.AWS_SES_CONFIG_DEFAULT ??
            'stg-digital-services-default',
          campaign:
            process.env.AWS_SES_CONFIG_CAMPAIGN ??
            'stg-notifications-email-campaign',
          onDemand:
            process.env.AWS_SES_CONFIG_ON_DEMAND ??
            'stg-notifications-on-demand',
          transactional:
            process.env.AWS_SES_CONFIG_TRANSACTIONAL ??
            'stg-digital-services-authorify-transactional',
        },
        bccAddresses: {
          emailReminder: valueToArray(
            process.env.AWS_SES_BCC_EMAIL_REMINDERS ?? 'it@authorify.com',
          ),
        },
        noreplyEmail: process.env.NOREPLY_EMAIL ?? 'noreply@authorify.com',
      },
      sns: {
        topics: {
          RM_MAGAZINE_GENERATION:
            process.env.AWS_SNS_TOPICS_RM_MAGAZINE_GENERATION ??
            'RM_MAGAZINE_GENERATION',
          RM_MAGAZINE_GENERATION_COVERS_FOR_LEAD:
            process.env.AWS_SNS_TOPICS_RM_MAGAZINE_COVERS_GENERATION_FOR_LEAD ??
            'RM_MAGAZINE_COVERS_GENERATION_FOR_LEAD',
        },
      },
      msk: {
        kafka: {
          brokers: process.env.AWS_MSK_KAFKA_BROKERS ?? 'localhost:9092',
        },
      },
    },
    reminderTemplate: {
      templateId: defaultToNumber(
        process.env.ONBOARD_COACHING_REMINDER_TEMPLATE,
        0,
      ),
    },
    csvExportTemplate: {
      templateId: defaultToNumber(process.env.EC_ANALYTICS_EXPORT_TEMPLATE, 0),
    },
    hubspotQuoteTemplate: {
      templateId: defaultToNumber(process.env.HS_QUOTE_LINK_TEMPLATE, 0),
    },
    upsellReportExportTemplate: {
      templateId: defaultToNumber(process.env.UPSELL_REPORT_EXPORT_TEMPLATE, 0),
    },
    socialMedia: {
      facebook: {
        developerId: process.env.FACEBOOK_DEVELOPER_ID ?? '100781399274196',
        token:
          process.env.FACEBOOK_TOKEN ??
          'EAAERkkisXZBIBAJjXpXKXFPcqMyO8aEzu3UK88AhHQ4L6GDFwqHVg17NqcYFmZCxPIbV8dgZAMXYTtNgXB8vMBhKeeZB6X0FZAi9o5w4BExWD0f0glPSQcd1xRvGclMEWhOnOtqvCDnp9rZCsgtFBnGKQwN7POiZBwPa1ZBf0CngRWHwLQaEJA8u4pOxqoPeWuCl7FrWpjBGZCtevZAhqlzyez',
      },
    },
    swagger: {
      username: process.env.SWAGGER_USERNAME ?? 'authorify',
      password: process.env.SWAGGER_PASSWORD ?? 'AutH0r!fY',
    },
    cms: {
      key: process.env.CMS_KEY ?? 'Please set CMS_KEY',
      url: process.env.CMS_URL ?? 'http://localhost:1337/api',
      app_config_chargify_products_list_id:
        process.env.APP_CONFIG_CHARGIFY_PRODUCTS_LIST_ID,
    },
    oldCms: {
      authUrl:
        process.env.OLD_CMS_AUTH_URL ??
        'https://cms.dev.authorify.com/auth/local',
      url: process.env.OLD_CMS_URL ?? 'https://cms.dev.authorify.com',
      user: process.env.OLD_CMS_USER ?? 'user',
      password: process.env.OLD_CMS_PASSWORD ?? 'password',
    },
    twilio: {
      accountSid:
        process.env.TWILIO_ACCOUNT_SID ?? 'Please provide twilio account sid',
      authToken:
        process.env.TWILIO_AUTH_TOKEN ?? 'Please provide twilio auth token',
      fromPhoneNumber:
        process.env.TWILIO_FROM_PHONE_NUMBER ??
        'Please provide twilio from phone number',
    },
    shippingEasy: {
      subDomain:
        process.env.SHIPPING_BASE_URL ?? 'https://app.shippingeasy.com/api/',
      apiKey:
        process.env.SHIPPING_API_KEY ?? 'Please provide shipping easy api key',
      apiSecret:
        process.env.SHIPPING_API_SECRET ??
        'Please provide shipping easy api key',
    },
    zoom: {
      key: process.env.ZOOM_JWT_TOKEN ?? 'Please set ZOOM_JWT_TOKEN',
      url: process.env.ZOOM_API_ENDPOINT ?? 'https://zoom.us',
      proxy:
        process.env.ZOOM_PROXY_URL ??
        'https://zoom.us/v2/phone/recording/download/',
      zoomUrl: process.env.ZOOM_API_URL ?? 'https://api.zoom.us/v2/',
      cronjobEnv: process.env.CRONJOB_ENV ?? 'production',
      zoomApiKey: process.env.ZOOM_API_KEY ?? 'Please set ZOOM_API_KEY',
      zoomApiSecret:
        process.env.ZOOM_API_SECRET ?? 'Please set ZOOM_API_SECRET',
      zoomServerOAuthUrl:
        process.env.ZOOM_SERVER_O_URL ?? 'Please set ZOOM_SERVER_O_URL',
      zoomBasicToken:
        process.env.ZOOM_BASIC_TOKEN ?? 'Please set ZOOM_BASIC_TOKEN',
      zoomSecretToken:
        process.env.ZOOM_SECRET_TOKEN ?? 'Please set ZOOM_SECRET_TOKEN',
    },
    google: {
      key: process.env.GOOGLE_CREDENTIALS ?? 'Please set GOOGLE_CREDENTIALS',
    },
    webinar: {
      url: process.env.WEBINAR_API_URL ?? 'https://api.joinnow.live',
    },
    stripe: {
      key: process.env.STRIPE_SECRET_KEY ?? 'Please set STRIPE_SECRET_KEY',
    },
    hubspot: {
      url: process.env.HUBSPOT_API_ENDPOINT ?? 'https://api.hubapi.com',
      key: process.env.HUBSPOT_API_KEY ?? 'Please set HUBSPOT_API_KEY',
      retries: defaultToNumber(process.env.HUBSPOT_API_RETRIES, 5),
      formsBaseUrl:
        process.env.HUBSPOT_FORMS_BASE_URL ?? 'https://api.hsforms.com',
      forceCustomerActive: process.env.HUBSPOT_FORCE_CUSTOMER_ACTIVE === 'true',
      ticket: {
        prefix:
          process.env.HUBSPOT_TICKET_PREFIX === 'production'
            ? ''
            : process.env.HUBSPOT_TICKET_PREFIX,
      },
    },
    elasticSearch: {
      url: process.env.ELASTIC_URL ?? 'http://localhost:9200',
      username: process.env.ELASTIC_USERNAME ?? 'Please set ELASTIC_USERNAME',
      password: process.env.ELASTIC_PASSWORD ?? 'Please set ELASTIC_PASSWORD',
    },
    logstash: {
      host: process.env.LOGSTASH_HOST,
      port: defaultToNumber(process.env.LOGSTASH_PORT, undefined),
      username: process.env.LOGSTASH_USERNAME,
      password: process.env.LOGSTASH_PASSWORD,
      level: process.env.LOGSTASH_LEVEL ?? 'info',
    },
    strayDomainConstants: {
      HS_OWNER_ID: process.env.HS_OWNER_ID ?? '45336631',
      HS_PIPELINE: process.env.HS_PIPELINE ?? '10880762',
      HS_PIPELINE_STAGE: process.env.HS_PIPELINE_STAGE ?? '10880763',
      HS_DENTIST_GUIDE_PIPELINE:
        process.env.HS_DENTIST_GUIDE_PIPELINE ?? '67410305',
      HS_DENTIST_GUIDE_PIPELINE_STAGE:
        process.env.HS_DENTIST_GUIDE_PIPELINE_STAGE ?? '131209571',
    },
    sendToPrintConstants: {
      HS_OWNER_ID: process.env.HS_OWNER_ID ?? '48014082',
      HS_PIPELINE: process.env.HS_PRINT_QUEUE_PIPELINE ?? '4948770',
      HS_PIPELINE_STAGE: process.env.HS_PRINT_QUEUE_PIPELINE_STAGE ?? '4948771',
      HS_DENTIST_GUIDE_PIPELINE:
        process.env.HS_DENTIST_GUIDE_PIPELINE ?? '67410305',
      HS_DENTIST_GUIDE_PIPELINE_STAGE:
        process.env.HS_DENTIST_GUIDE_PIPELINE_STAGE ?? '131209571',
    },
    content: {
      calendar: {
        createEvent: {
          title: `${
            isProd ? '' : 'DEVELOPMENT TESTING '
          }{{FIRST_NAME}}, your Authorify coaching call has been confirmed!`,
          description: `${
            isProd ? '' : 'DEVELOPMENT TESTING '
          }Congratulations! You are scheduled for an introduction call to learn how to grow your business with a unique branding strategy.

          You'll just need to click on the zoom link from this invite and be in front of your computer for the call.

          I'll be sharing my screen for part of the session reviewing some strategies we have for Authorify members and how we can help you scale your business.I'm excited to learn more about you and how Authorify can help grow your business.`,
        },
      },
    },
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: defaultToNumber(process.env.REDIS_PORT, 6379),
      username: process.env.REDIS_USERNAME ?? '',
      password: process.env.REDIS_PASSWORD ?? '',
    },
    features: {
      trainingWebinar: process.env.FEATURE_TRAINING_WEBINAR === '1',
    },
    chargify: {
      sub_domain:
        process.env.CHARGIFY_SUB_DOMAIN ?? 'https://authorify-dev.chargify.com',
      api_key: process.env.CHARGIFY_API_KEY ?? '',
    },
    flippingAPI: {
      key: process.env.FLIPPING_API_KEY ?? 'no-key',
      url: process.env.FLIPPING_API_URL ?? 'no-url',
    },
    onboardSettings: {
      scheduleCoachDuration: defaultToNumber(
        process.env.ONBOARD_SCHEDULE_COACH_DURATION,
        30,
      ),
    },
    afyLogger: {
      url: process.env.AFY_LOGGER_URL ?? '',
    },
    quotes: {
      hs_esign_enabled: process.env.HS_ESIGN_ENABLED ?? 'true',
      hs_terms:
        process.env.HS_QUOTE_TERMS ??
        '<div><strong>Taxes, Regulatory Surcharges: </strong>Total shown above does not include any taxes or regulatory surcharges that may apply. Any such taxes or regulatory surcharges are the sole responsibility of the customer. This is not an invoice. </div><br> <div>By signing below, you agree to be bound by all of the terms of this agreement, including the Terms of Use, which are available at <a href="https://authorify.com/terms/" target="_blank" rel="nofollow noopener noreferrer">https://authorify.com/terms/</a> and are incorporated by reference. </div>',
      hs_domain: process.env.HS_QUOTE_DOMAIN ?? 'quotes.smartagents.com',
      hs_currency: process.env.HS_QUOTE_CURRENCY ?? 'USD',
      hs_sender_company_name: process.env.HS_COMPANY_NAME ?? 'Authorify',
      hs_sender_company_address:
        process.env.HS_COMPANY_ADDRESS ?? '3500 Beachwood Court #203',
      hs_sender_company_city: process.env.HS_COMPANY_CITY ?? 'Jacksonville',
      hs_sender_company_zip: process.env.HS_COMPANY_ZIP ?? '32216',
      hs_sender_company_state: process.env.HS_COMPANY_STATE ?? 'FL',
      hs_sender_company_country: process.env.HS_COMPANY_COUNTRY ?? 'US',
    },
    quoteTemplate: process.env.QUOTE_TEMPLATE ?? '238203716489',
    allowedLineItemsId:
      valueToArray(process.env.ALLOWED_LINE_ITEMS_ID ?? '') ?? [],
  };
};
