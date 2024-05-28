"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosDefaultsConfig = void 0;
const transform_response_1 = require("./transform.response");
const transform_request_1 = require("./transform.request");
const axiosDefaultsConfig = (extraHeaders = {}) => {
    return {
        headers: Object.assign({ 'Content-Type': 'application/json', Accept: 'application/json' }, extraHeaders),
        transformResponse: transform_response_1.transformResponse,
        transformRequest: transform_request_1.transformRequest,
    };
};
exports.axiosDefaultsConfig = axiosDefaultsConfig;
//# sourceMappingURL=axios-defaults-config.js.map