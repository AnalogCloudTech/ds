"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leads = exports.ChangeStatus = exports.UploadImage = void 0;
var UploadImage;
(function (UploadImage) {
    UploadImage["YES"] = "yes";
    UploadImage["NO"] = "no";
})(UploadImage = exports.UploadImage || (exports.UploadImage = {}));
var ChangeStatus;
(function (ChangeStatus) {
    ChangeStatus["ALL"] = "all";
    ChangeStatus["APPROVED"] = "approved";
    ChangeStatus["FOR_REVIEW"] = "for-review";
    ChangeStatus["SUBMITTED"] = "submitted";
})(ChangeStatus = exports.ChangeStatus || (exports.ChangeStatus = {}));
var Leads;
(function (Leads) {
    Leads["WITH_LEADS"] = "with_leads";
    Leads["WITHOUT_LEADS"] = "without_leads";
    Leads["BOTH"] = "send_to_both_members_and_leads";
})(Leads = exports.Leads || (exports.Leads = {}));
//# sourceMappingURL=types.js.map