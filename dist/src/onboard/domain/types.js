"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepStatus = exports.DefaultSteps = exports.Step = exports.AccountType = exports.OfferType = exports.Countries = exports.SessionStatus = void 0;
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["INITIAL"] = "initial";
    SessionStatus["ONGOING"] = "ongoing";
    SessionStatus["FINISHED"] = "finished";
    SessionStatus["CANCELED"] = "canceled";
})(SessionStatus = exports.SessionStatus || (exports.SessionStatus = {}));
var Countries;
(function (Countries) {
    Countries["CANADA"] = "Canada";
    Countries["USA"] = "USA";
})(Countries = exports.Countries || (exports.Countries = {}));
var OfferType;
(function (OfferType) {
    OfferType["MAIN"] = "main";
    OfferType["UPSELL"] = "upsell";
    OfferType["DOWNSELL"] = "downsell";
})(OfferType = exports.OfferType || (exports.OfferType = {}));
var AccountType;
(function (AccountType) {
    AccountType["REALTOR"] = "Realtor";
    AccountType["DENTIST"] = "Dentist";
    AccountType["CONTRACTED"] = "Contracted";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
var Step;
(function (Step) {
    Step["PLACE_ORDER"] = "place_order";
    Step["PLACE_ORDER_WAIT"] = "place_order_wait";
    Step["ADDON"] = "addon";
    Step["ADDON_WAIT"] = "addon_wait";
    Step["SCHEDULE_COACHING"] = "schedule_coaching";
    Step["SCHEDULE_COACHING_WAIT"] = "schedule_coaching_wait";
    Step["TRAINING_WEBINAR"] = "training_webinar";
    Step["TRAINING_WEBINAR_WAIT"] = "training_webinar_wait";
    Step["BOOK_DETAILS"] = "book_details";
    Step["BOOK_DETAILS_WAIT"] = "book_details_wait";
    Step["DENTIST_GUIDE_DETAILS"] = "dentist_guide_details";
    Step["YOUR_BOOK"] = "your_book";
    Step["YOUR_GUIDE"] = "your_guide";
    Step["ORDER_CONFIRMATION"] = "order_confirmation";
    Step["DONE"] = "done";
    Step["ACCOUNT_WAIT"] = "account_wait";
})(Step = exports.Step || (exports.Step = {}));
exports.DefaultSteps = [
    Step.PLACE_ORDER,
    Step.PLACE_ORDER_WAIT,
    Step.SCHEDULE_COACHING,
    Step.TRAINING_WEBINAR,
    Step.BOOK_DETAILS,
    Step.BOOK_DETAILS_WAIT,
    Step.YOUR_BOOK,
    Step.ORDER_CONFIRMATION,
    Step.DONE,
];
var StepStatus;
(function (StepStatus) {
    StepStatus["SUCCESS"] = "success";
    StepStatus["ERROR"] = "error";
})(StepStatus = exports.StepStatus || (exports.StepStatus = {}));
//# sourceMappingURL=types.js.map