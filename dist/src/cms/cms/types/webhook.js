"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.Models = void 0;
var Models;
(function (Models) {
    Models["SEGMENT"] = "segment";
    Models["EMAIL_TEMPLATE"] = "email-template";
})(Models = exports.Models || (exports.Models = {}));
var EventType;
(function (EventType) {
    EventType["ENTRY_CREATE"] = "entry.create";
    EventType["ENTRY_UPDATE"] = "entry.update";
    EventType["ENTRY_DELETE"] = "entry.delete";
    EventType["ENTRY_PUBLISH"] = "entry.publish";
    EventType["ENTRY_UNPUBLISH"] = "entry.unpublish";
    EventType["MEDIA_CREATE"] = "media.create";
    EventType["MEDIA_UPDATE"] = "media.update";
    EventType["MEDIA_DELETE"] = "media.delete";
})(EventType = exports.EventType || (exports.EventType = {}));
//# sourceMappingURL=webhook.js.map