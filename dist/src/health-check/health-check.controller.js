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
exports.HealthCheckController = void 0;
const common_1 = require("@nestjs/common");
const health_check_service_1 = require("./health-check.service");
const string_1 = require("../internal/utils/string");
const auth_service_1 = require("../auth/auth.service");
let HealthCheckController = class HealthCheckController {
    constructor(heathCheckService) {
        this.heathCheckService = heathCheckService;
    }
    heath() {
        return this.heathCheckService.systemHealth();
    }
    service(service) {
        try {
            const method = `check${(0, string_1.capitalizeFirstLetter)(service)}`;
            return this.heathCheckService.selectService(method);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new common_1.NotFoundException('Service not found => Available services [redis, strapi, bba, elasticsearch]');
            }
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, auth_service_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthCheckController.prototype, "heath", null);
__decorate([
    (0, common_1.Get)(':service'),
    __param(0, (0, common_1.Param)('service')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HealthCheckController.prototype, "service", null);
HealthCheckController = __decorate([
    (0, common_1.Controller)({ path: 'health', version: '1' }),
    __metadata("design:paramtypes", [health_check_service_1.HealthCheckService])
], HealthCheckController);
exports.HealthCheckController = HealthCheckController;
//# sourceMappingURL=health-check.controller.js.map