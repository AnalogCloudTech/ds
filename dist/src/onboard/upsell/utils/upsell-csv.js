"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUpsellCSV = void 0;
const luxon_1 = require("luxon");
const formatUpsellCSV = (data) => {
    const formattedData = [];
    data.forEach((upsell) => {
        const { customer, offer, utmSource, utmMedium, utmTerm, utmContent, channel, createdAt, } = upsell;
        const { firstName, lastName, email } = customer;
        const { title } = offer;
        const createDate = luxon_1.DateTime.fromJSDate(new Date(createdAt))
            .setZone('America/New_York')
            .toFormat('ff');
        const formattedRow = {
            'First Name': firstName || '',
            'Last Name': lastName || '',
            Email: email || '',
            Offer: title || '',
            Channel: channel || '',
            'UTM Source': utmSource || '',
            'UTM Medium': utmMedium || '',
            'UTM Content': utmContent || '',
            'UTM Term': utmTerm || '',
            'Date of Transaction': createDate,
        };
        formattedData.push(formattedRow);
    });
    return formattedData;
};
exports.formatUpsellCSV = formatUpsellCSV;
//# sourceMappingURL=upsell-csv.js.map