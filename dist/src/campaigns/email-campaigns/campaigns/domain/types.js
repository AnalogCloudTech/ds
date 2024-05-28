"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignHandler = exports.CampaignHistoryType = exports.CampaignStatus = void 0;
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["ACTIVE"] = "active";
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["STOPPED"] = "stopped";
    CampaignStatus["CANCELED"] = "canceled";
})(CampaignStatus = exports.CampaignStatus || (exports.CampaignStatus = {}));
var CampaignHistoryType;
(function (CampaignHistoryType) {
    CampaignHistoryType["ABSOLUTE"] = "absolute";
    CampaignHistoryType["RELATIVE"] = "relative";
})(CampaignHistoryType = exports.CampaignHistoryType || (exports.CampaignHistoryType = {}));
var CampaignHandler;
(function (CampaignHandler) {
    CampaignHandler["ABSOLUTE"] = "sendAbsoluteCampaign";
    CampaignHandler["RELATIVE"] = "sendRelativeCampaign";
})(CampaignHandler = exports.CampaignHandler || (exports.CampaignHandler = {}));
//# sourceMappingURL=types.js.map