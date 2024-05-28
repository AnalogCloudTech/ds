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
exports.FacebookController = void 0;
const common_1 = require("@nestjs/common");
const facebook_service_1 = require("./facebook.service");
const create_facebook_dto_1 = require("./dto/create-facebook.dto");
const facebook_domain_1 = require("./domain/facebook.domain");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
let FacebookController = class FacebookController {
    constructor(facebookService) {
        this.facebookService = facebookService;
    }
    async create(createFacebookDto) {
        return this.facebookService.create(createFacebookDto);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(facebook_domain_1.FacebookDomain),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_facebook_dto_1.CreateFacebookDto]),
    __metadata("design:returntype", Promise)
], FacebookController.prototype, "create", null);
FacebookController = __decorate([
    (0, common_1.Controller)({ path: 'social-media/facebook', version: '1' }),
    __metadata("design:paramtypes", [facebook_service_1.FacebookService])
], FacebookController);
exports.FacebookController = FacebookController;
//# sourceMappingURL=facebook.controller.js.map