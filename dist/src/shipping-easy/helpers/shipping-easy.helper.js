"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareApiSignature = exports.formatQueryString = void 0;
const crypto_1 = require("crypto");
const qs_1 = require("qs");
function formatQueryString(queryObject) {
    return (0, qs_1.stringify)(queryObject, {
        encodeValuesOnly: true,
    });
}
exports.formatQueryString = formatQueryString;
function prepareApiSignature(method, url, timestamp, queryParamObject, apiKey, apiSecret) {
    const formatedQueryString = formatQueryString(queryParamObject);
    const signatureString = `${method.toString()}&${url}&api_key=${apiKey}&api_timestamp=${timestamp}&${formatedQueryString}`;
    const hmac = (0, crypto_1.createHmac)('sha256', apiSecret)
        .update(signatureString)
        .digest('hex');
    return hmac;
}
exports.prepareApiSignature = prepareApiSignature;
//# sourceMappingURL=shipping-easy.helper.js.map