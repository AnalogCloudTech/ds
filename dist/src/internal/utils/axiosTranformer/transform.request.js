"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformRequest = void 0;
const transformRequest = (request) => {
    try {
        request = JSON.stringify(request);
    }
    catch (err) {
        console.log(err);
        console.log('error transforming the following request:', request);
    }
    return request;
};
exports.transformRequest = transformRequest;
//# sourceMappingURL=transform.request.js.map