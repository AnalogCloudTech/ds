"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFilterQueryForCampaignLeads = void 0;
function buildFilterQueryForCampaignLeads(customerId, customerEmail, segments, allSegments = false) {
    const filters = {
        $and: [
            {
                $or: [{ customer: customerId }, { customerEmail: customerEmail }],
            },
            {
                isValid: true,
                unsubscribed: false,
            },
        ],
    };
    if (!allSegments) {
        filters.$and.push({
            $or: [{ segments: { $in: segments } }, { allSegments: true }],
        });
    }
    return filters;
}
exports.buildFilterQueryForCampaignLeads = buildFilterQueryForCampaignLeads;
//# sourceMappingURL=filters.js.map