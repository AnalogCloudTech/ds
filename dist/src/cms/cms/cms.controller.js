"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsController = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const qs = require('qs');
let CmsController = class CmsController {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async passthruGet(req, routeObject, params) {
        var _a;
        const route = (_a = routeObject[0]) !== null && _a !== void 0 ? _a : '';
        const stringifiedParams = qs.stringify(params);
        const url = `/${route}?${stringifiedParams}`;
        const response = await this.cmsService.passthruGet(url);
        return response === null || response === void 0 ? void 0 : response.data;
    }
};
__decorate([
    (0, common_1.Get)('*'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "passthruGet", null);
CmsController = __decorate([
    (0, common_1.Controller)({ path: 'cms', version: '1' }),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], CmsController);
exports.CmsController = CmsController;
//# sourceMappingURL=cms.controller.js.map