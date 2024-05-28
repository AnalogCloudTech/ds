"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationTypes = exports.LeadHistoryStatus = void 0;
var LeadHistoryStatus;
(function (LeadHistoryStatus) {
    LeadHistoryStatus["SEND"] = "send";
    LeadHistoryStatus["REJECTED"] = "rejected";
    LeadHistoryStatus["BOUNCE"] = "bounce";
    LeadHistoryStatus["COMPLAINT"] = "complaint";
    LeadHistoryStatus["DELIVERY"] = "delivery";
    LeadHistoryStatus["DELIVERY_DELAY"] = "delivery_delay";
    LeadHistoryStatus["OPEN"] = "open";
    LeadHistoryStatus["CLICK"] = "click";
    LeadHistoryStatus["RENDERINGFAILURE"] = "rendering_failure";
    LeadHistoryStatus["UNSUBSCRIBED"] = "unsubscribed";
    LeadHistoryStatus["DEFAULT"] = "default";
    LeadHistoryStatus["SOFT_BOUNCE"] = "soft_bounce";
})(LeadHistoryStatus = exports.LeadHistoryStatus || (exports.LeadHistoryStatus = {}));
var RelationTypes;
(function (RelationTypes) {
    RelationTypes["ON_DEMAND_EMAILS"] = "OnDemandEmail";
    RelationTypes["CAMPAIGNS"] = "Campaign";
    RelationTypes["CAMPAIGNS_HISTORY"] = "CampaignHistory";
})(RelationTypes = exports.RelationTypes || (exports.RelationTypes = {}));
//# sourceMappingURL=types.js.map