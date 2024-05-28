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
exports.ChargifyController = void 0;
const common_1 = require("@nestjs/common");
const chargify_service_1 = require("./chargify.service");
const url_1 = require("../../internal/utils/url");
let ChargifyController = class ChargifyController {
    constructor(chargifyService) {
        this.chargifyService = chargifyService;
    }
    async passthruGet(req, routeObject, params, body) {
        const reqMethod = req.method.toLowerCase();
        const url = (0, url_1.generateUrl)(routeObject, params);
        return this.chargifyService.passthru(url, reqMethod, body);
    }
};
__decorate([
    (0, common_1.All)('*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChargifyController.prototype, "passthruGet", null);
ChargifyController = __decorate([
    (0, common_1.Controller)({ path: 'chargify', version: '1' }),
    __metadata("design:paramtypes", [chargify_service_1.ChargifyService])
], ChargifyController);
exports.ChargifyController = ChargifyController;
//# sourceMappingURL=chargify.controller.js.map