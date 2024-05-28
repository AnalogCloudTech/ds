"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceRouteParameter = exports.HEALTH_CHECK = exports.ROUTE_SOCIAL_MEDIA_CONFIG = exports.ROUTE_APP_CONFIG = exports.ROUTE_REFERRAL_MARKETING_MAGAZINE = exports.ROUTE_PAYMENT_PLANS = exports.ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS = exports.ROUTE_SMS_TEMPLATES_DETAILS = exports.ROUTE_SMS_TEMPLATES_LIST = exports.ROUTE_SOCIAL_MEDIA_TEMPLATES_LIST = exports.ROUTE_TEMPLATES_DELETE = exports.ROUTE_TEMPLATES_UPDATE = exports.ROUTE_TEMPLATES_CREATE = exports.ROUTE_TEMPLATES_DETAILS = exports.ROUTE_TEMPLATES_LIST = exports.ROUTE_SOCIAL_MEDIA_CONTENTS_DETAILS = exports.ROUTE_SOCIAL_MEDIA_CONTENTS_LIST = exports.ROUTE_CONTENTS_DETAILS = exports.ROUTE_CONTENTS_LIST = exports.ROUTE_SEGMENTS_LIST = void 0;
exports.ROUTE_SEGMENTS_LIST = '/segments';
exports.ROUTE_CONTENTS_LIST = '/email-campaigns';
exports.ROUTE_CONTENTS_DETAILS = '/email-campaigns/:id';
exports.ROUTE_SOCIAL_MEDIA_CONTENTS_LIST = '/social-media-campaign-contents';
exports.ROUTE_SOCIAL_MEDIA_CONTENTS_DETAILS = '/social-media-campaign-contents/:id';
exports.ROUTE_TEMPLATES_LIST = '/email-templates';
exports.ROUTE_TEMPLATES_DETAILS = '/email-templates/:id';
exports.ROUTE_TEMPLATES_CREATE = '/email-templates';
exports.ROUTE_TEMPLATES_UPDATE = '/email-templates/:id';
exports.ROUTE_TEMPLATES_DELETE = '/email-templates/:id';
exports.ROUTE_SOCIAL_MEDIA_TEMPLATES_LIST = '/social-media-templates';
exports.ROUTE_SMS_TEMPLATES_LIST = '/sms-templates';
exports.ROUTE_SMS_TEMPLATES_DETAILS = '/sms-templates/:id';
exports.ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS = '/social-media-templates/:id';
exports.ROUTE_PAYMENT_PLANS = '/product-packages';
exports.ROUTE_REFERRAL_MARKETING_MAGAZINE = '/rm-magazines';
exports.ROUTE_APP_CONFIG = '/app-configs/:id';
exports.ROUTE_SOCIAL_MEDIA_CONFIG = `/app-configs`;
exports.HEALTH_CHECK = '/segments';
function replaceRouteParameter(route, param, value) {
    return route.replace(param, value);
}
exports.replaceRouteParameter = replaceRouteParameter;
//# sourceMappingURL=index.js.map