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
exports.CustomersController = void 0;
const is_admin_guard_1 = require("../../internal/common/guards/is-admin.guard");
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const customer_1 = require("./domain/customer");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const email_lower_case_pipe_1 = require("../../internal/common/pipes/email-lower-case.pipe");
const auth_service_1 = require("../../auth/auth.service");
const customer_by_identities_pipe_1 = require("./pipes/transform/customer-by-identities.pipe");
const customer_schema_1 = require("./schemas/customer.schema");
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
const update_avatar_dto_1 = require("./dto/update-avatar.dto");
const hubspot_service_1 = require("../../legacy/dis/legacy/hubspot/hubspot.service");
const find_customer_by_name_or_email_dto_1 = require("./dto/find-customer-by-name-or-email.dto");
const paginator_1 = require("../../internal/utils/paginator");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
let CustomersController = class CustomersController {
    constructor(customersService, hubspotService) {
        this.customersService = customersService;
        this.hubspotService = hubspotService;
    }
    async getAllCustomers({ page, perPage }) {
        return this.customersService.getAllCustomers(page, perPage);
    }
    getCustomer(customer) {
        return customer;
    }
    async register(registerCustomer) {
        const result = await this.customersService.create(registerCustomer);
        return result.castTo(customer_1.Customer);
    }
    update(customer, updateProperties) {
        return this.customersService.update(customer, updateProperties);
    }
    async publicUpdateAvatar({ email, avatar }) {
        const update = await this.customersService.publicUpdate(email, avatar);
        await this.hubspotService.createOrUpdateContact({
            email,
            afy_customer_profile_image_url: avatar,
        });
        return { status: !!update };
    }
    async updateFlippingBookPreferences(id, flippingBookPreferences) {
        await this.customersService.updateFlippingBookPreferences(id, flippingBookPreferences);
    }
    async findCustomerByTerm(dto) {
        return await this.customersService.listByNameOrEmail(dto.nameOrEmail);
    }
    async addLandingPageWebsite(customer, body) {
        return this.customersService.addLandingPageWebsite(customer._id.toString(), body);
    }
    async getLandingPageWebsite(customer, id) {
        return this.customersService.getLandingPageWebsite(customer.email, id);
    }
};
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)('find-all'),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAllCustomers", null);
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getCustomer", null);
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)(email_lower_case_pipe_1.EmailLowerCasePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "register", null);
__decorate([
    (0, common_1.Patch)(''),
    (0, serialize_interceptor_1.Serialize)(customer_1.Customer),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "update", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.Patch)('avatar'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_avatar_dto_1.UpdateAvatarDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "publicUpdateAvatar", null);
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Patch)('/flippingbookpreferences/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateFlippingBookPreferences", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_1.Customer),
    (0, common_1.Get)('list-customers-by-name-or-email'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_customer_by_name_or_email_dto_1.FindCustomerByNameOrEmailDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findCustomerByTerm", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_1.Customer),
    (0, common_1.Post)('add-landing-page-website'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_schema_1.LandingPageWebsite]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "addLandingPageWebsite", null);
__decorate([
    (0, common_1.Get)('get-landing-page-website/:id'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getLandingPageWebsite", null);
CustomersController = __decorate([
    (0, common_1.Controller)({ path: 'customers', version: '1' }),
    __metadata("design:paramtypes", [customers_service_1.CustomersService,
        hubspot_service_1.HubspotService])
], CustomersController);
exports.CustomersController = CustomersController;
//# sourceMappingURL=customers.controller.js.map