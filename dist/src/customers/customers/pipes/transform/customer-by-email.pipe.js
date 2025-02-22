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
exports.CustomerByEmailPipe = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const customers_service_1 = require("../../customers.service");
let CustomerByEmailPipe = class CustomerByEmailPipe {
    constructor(service, request) {
        this.service = service;
        this.request = request;
    }
    async transform() {
        const user = this.request.user;
        const email = user.email;
        const customer = await this.service.findByEmail(email);
        if (!customer) {
            throw new common_1.HttpException({ message: 'Customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return customer;
    }
};
CustomerByEmailPipe = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [customers_service_1.CustomersService, Object])
], CustomerByEmailPipe);
exports.CustomerByEmailPipe = CustomerByEmailPipe;
//# sourceMappingURL=customer-by-email.pipe.js.map