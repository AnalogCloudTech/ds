"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_ATTEMPTS = exports.STATUS = exports.ACTIONS = exports.HubspotObjectTypes = void 0;
var HubspotObjectTypes;
(function (HubspotObjectTypes) {
    HubspotObjectTypes["DEAL"] = "deal";
    HubspotObjectTypes["CONTACT"] = "contact";
    HubspotObjectTypes["COMPANIES"] = "companies";
    HubspotObjectTypes["TICKETS"] = "tickets";
    HubspotObjectTypes["PRODUCTS"] = "products";
})(HubspotObjectTypes = exports.HubspotObjectTypes || (exports.HubspotObjectTypes = {}));
exports.ACTIONS = {
    ADD_CREDITS: 'add_credits',
    ENROLL_CONTACT_TO_LIST: 'enroll_contact_to_list',
    SET_BOOK_PACKAGES: 'set_book_packages',
};
exports.STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
};
exports.MAX_ATTEMPTS = 5;
//# sourceMappingURL=types.js.map