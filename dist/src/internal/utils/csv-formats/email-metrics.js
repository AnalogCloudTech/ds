"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMetrics = void 0;
const luxon_1 = require("luxon");
const formatMetrics = (metrics) => {
    const formattedMetrics = [];
    metrics.data.forEach((metric) => {
        if (metric.campaign) {
            const campaignName = metric.campaign.name;
            metric.metrics.forEach((m) => {
                m.events.forEach((event) => {
                    const createDate = luxon_1.DateTime.fromISO(event.createdAt)
                        .setZone('America/New_York')
                        .toFormat('ff');
                    formattedMetrics.push({
                        'Campaign Name': campaignName,
                        'Event Type': event.type,
                        From: event.from,
                        To: event.to,
                        Timestamp: createDate,
                    });
                });
            });
        }
    });
    return formattedMetrics;
};
exports.formatMetrics = formatMetrics;
//# sourceMappingURL=email-metrics.js.map