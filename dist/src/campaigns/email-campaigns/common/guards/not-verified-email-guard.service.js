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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotVerifiedEmailGuard = void 0;
const common_1 = require("@nestjs/common");
const ses_service_1 = require("../../../../internal/libs/aws/ses/ses.service");
const customers_service_1 = require("../../../../customers/customers/customers.service");
const lodash_1 = require("lodash");
let NotVerifiedEmailGuard = class NotVerifiedEmailGuard {
    constructor(sesService, customersService) {
        this.sesService = sesService;
        this.customersService = customersService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const identities = user.identities;
        const customer = await this.customersService.findByIdentities(identities);
        const email = (0, lodash_1.get)(customer, ['attributes', 'email']);
        const isVerified = await this.sesService.emailIsVerified(email);
        if (isVerified) {
            throw new common_1.ForbiddenException('Identity already verified');
        }
        return true;
    }
};
NotVerifiedEmailGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ses_service_1.SesService,
        customers_service_1.CustomersService])
], NotVerifiedEmailGuard);
exports.NotVerifiedEmailGuard = NotVerifiedEmailGuard;
//# sourceMappingURL=not-verified-email-guard.service.js.map