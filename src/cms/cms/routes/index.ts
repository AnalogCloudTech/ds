export const ROUTE_SEGMENTS_LIST = '/segments';

export const ROUTE_CONTENTS_LIST = '/email-campaigns';
export const ROUTE_CONTENTS_DETAILS = '/email-campaigns/:id';

export const ROUTE_SOCIAL_MEDIA_CONTENTS_LIST =
  '/social-media-campaign-contents';
export const ROUTE_SOCIAL_MEDIA_CONTENTS_DETAILS =
  '/social-media-campaign-contents/:id';

export const ROUTE_TEMPLATES_LIST = '/email-templates';
export const ROUTE_TEMPLATES_DETAILS = '/email-templates/:id';
export const ROUTE_TEMPLATES_CREATE = '/email-templates';
export const ROUTE_TEMPLATES_UPDATE = '/email-templates/:id';
export const ROUTE_TEMPLATES_DELETE = '/email-templates/:id';

export const ROUTE_SOCIAL_MEDIA_TEMPLATES_LIST = '/social-media-templates';
export const ROUTE_SMS_TEMPLATES_LIST = '/sms-templates';
export const ROUTE_SMS_TEMPLATES_DETAILS = '/sms-templates/:id';
export const ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS =
  '/social-media-templates/:id';

export const ROUTE_PAYMENT_PLANS = '/product-packages';
export const ROUTE_REFERRAL_MARKETING_MAGAZINE = '/rm-magazines';

export const ROUTE_APP_CONFIG = '/app-configs/:id';

export const ROUTE_SOCIAL_MEDIA_CONFIG = `/app-configs`;

export const HEALTH_CHECK = '/segments';

export function replaceRouteParameter(route, param, value): string {
  return route.replace(param, value);
}
