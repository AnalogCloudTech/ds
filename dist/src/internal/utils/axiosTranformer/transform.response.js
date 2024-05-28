"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformResponse = void 0;
const transformResponse = (response) => {
    try {
        response = JSON.parse(response);
    }
    catch (err) {
        console.log(err);
        console.log('error transforming the following response:', response);
    }
    return response;
};
exports.transformResponse = transformResponse;
//# sourceMappingURL=transform.response.js.map