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
exports.CustomerPipeByIdentities = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const customers_service_1 = require("../../customers.service");
let CustomerPipeByIdentities = class CustomerPipeByIdentities {
    constructor(service, request) {
        this.service = service;
        this.request = request;
    }
    async transform() {
        var _a, _b;
        const origin = this.request.user ? 'jwt' : 'afy-api-key';
        const user = (_a = this.request.user) !== null && _a !== void 0 ? _a : this.request.body.user;
        const email = user.email;
        const identities = ((_b = user.identities) !== null && _b !== void 0 ? _b : [user.email]);
        let customer = await this.service.findByIdentities(identities);
        if (!customer) {
            if (origin === 'afy-api-key') {
                throw new common_1.NotFoundException('Customer not found');
            }
            const dto = {
                email,
                firstName: user.firstname,
                lastName: user.lastname,
                phone: user.mobilephone,
                password: '',
                billing: {
                    state: user.state,
                    country: user.country,
                    zip: user.zip,
                    city: user.city,
                    address1: '',
                },
                attributes: null,
                chargifyToken: '',
                smsPreferences: {
                    schedulingCoachReminders: false,
                },
            };
            customer = await this.service.create(dto);
        }
        return customer;
    }
};
CustomerPipeByIdentities = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [customers_service_1.CustomersService, Object])
], CustomerPipeByIdentities);
exports.CustomerPipeByIdentities = CustomerPipeByIdentities;
//# sourceMappingURL=customer-by-identities.pipe.js.map