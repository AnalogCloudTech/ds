"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processors = exports.UsageFields = exports.LastUsage = void 0;
class LastUsage {
}
exports.LastUsage = LastUsage;
var UsageFields;
(function (UsageFields) {
    UsageFields["ON_DEMAND_EMAIL"] = "onDemandEmail";
    UsageFields["EMAIL_CAMPAIGN"] = "emailCampaign";
})(UsageFields = exports.UsageFields || (exports.UsageFields = {}));
var Processors;
(function (Processors) {
    Processors["csv"] = "fillFromRawCsvFile";
    Processors["xls"] = "fillFromXLSFile";
    Processors["xlsx"] = "fillFromXLSFile";
})(Processors = exports.Processors || (exports.Processors = {}));
//# sourceMappingURL=types.js.map