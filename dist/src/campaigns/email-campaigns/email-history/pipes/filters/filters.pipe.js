"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const types_1 = require("../../schemas/types");
let EmailHistoryFilters = class EmailHistoryFilters {
    transform({ types, status }) {
        const typesMap = {
            OnDemandEmails: types_1.RelationTypes.ON_DEMAND_EMAILS,
            Campaigns: types_1.RelationTypes.CAMPAIGNS,
        };
        const statusMap = {
            Bounced: types_1.LeadHistoryStatus.BOUNCE,
            Opened: types_1.LeadHistoryStatus.OPEN,
            Rejected: types_1.LeadHistoryStatus.REJECTED,
            Spam: types_1.LeadHistoryStatus.COMPLAINT,
            Success: types_1.LeadHistoryStatus.DELIVERY,
            Unsubscribed: types_1.LeadHistoryStatus.UNSUBSCRIBED,
            Sent: types_1.LeadHistoryStatus.SEND,
        };
        const typesParsed = types === null || types === void 0 ? void 0 : types.split(',').reduce((acc, type) => {
            if (typesMap[type]) {
                acc.push(typesMap[type]);
            }
            return acc;
        }, []);
        const statusParsed = status === null || status === void 0 ? void 0 : status.split(',').reduce((acc, status) => {
            if (statusMap[status]) {
                acc.push(statusMap[status]);
            }
            return acc;
        }, []);
        return {
            types: typesParsed || null,
            status: statusParsed || null,
        };
    }
};
EmailHistoryFilters = __decorate([
    (0, common_1.Injectable)()
], EmailHistoryFilters);
exports.default = EmailHistoryFilters;
//# sourceMappingURL=filters.pipe.js.map