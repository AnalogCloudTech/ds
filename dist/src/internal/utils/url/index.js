"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAll = exports.replaceRouteParameter = exports.paramsStringify = exports.generateUrl = void 0;
const qs = require("qs");
function generateUrl(routeObject, params) {
    var _a;
    const route = (_a = routeObject[0]) !== null && _a !== void 0 ? _a : '';
    const stringifiedParams = qs.stringify(params);
    const url = `/${route}?${stringifiedParams}`;
    return url;
}
exports.generateUrl = generateUrl;
const paramsStringify = (params) => qs.stringify(params) || '';
exports.paramsStringify = paramsStringify;
function replaceRouteParameter(route, param, value) {
    return route.replace(param, value);
}
exports.replaceRouteParameter = replaceRouteParameter;
function replaceAll(str, mapObj) {
    const re = new RegExp(Object.keys(mapObj).join('|'), 'gi');
    return str.replace(re, function (matched) {
        return mapObj[matched.toLowerCase()];
    });
}
exports.replaceAll = replaceAll;
//# sourceMappingURL=index.js.map