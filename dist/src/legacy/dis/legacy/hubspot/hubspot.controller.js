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
exports.HubspotController = void 0;
const common_1 = require("@nestjs/common");
const hubspot_service_1 = require("./hubspot.service");
const createTicket_dto_1 = require("./dto/createTicket.dto");
const create_contact_dto_1 = require("./dto/create-contact.dto");
const auth_service_1 = require("../../../../auth/auth.service");
const updateCreditsAndPackages_dto_1 = require("./dto/updateCreditsAndPackages.dto");
const addContactToWorkFlow_dto_1 = require("./dto/addContactToWorkFlow.dto");
const contact_dto_1 = require("./dto/contact.dto");
const validate_password_confirmation_pipe_1 = require("./pipes/validate-password-confirmation.pipe");
const transform_password_encrypted_pipe_1 = require("./pipes/transform-password-encrypted.pipe");
const customer_by_identities_pipe_1 = require("../../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../../internal/common/contexts");
const validation_transform_pipe_1 = require("../../../../internal/common/pipes/validation-transform.pipe");
const products_dto_1 = require("./dto/products.dto");
const form_submission_dto_1 = require("./dto/form-submission.dto");
let HubspotController = class HubspotController {
    constructor(hubspotService, logger) {
        this.hubspotService = hubspotService;
        this.logger = logger;
    }
    register() {
        return 'this endpoint is deprecated please use the Calendar module, refer to api documentation for more info';
    }
    createTicket(createTicketDto) {
        return this.hubspotService.createTicket(createTicketDto);
    }
    getAutoLoginToken(id) {
        return this.hubspotService.findOrCreateAutoLoginToken(id);
    }
    authenticate(email, password) {
        return this.hubspotService.authenticate(email, password);
    }
    async createOrUpdateContact(customer, contact) {
        this.logger.log({
            payload: {
                step: 'start',
                message: 'before update',
                method: 'HubspotController@createOrUpdateContact',
                executedBy: customer,
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        const createOrUpdateContact = await this.hubspotService.createOrUpdateContact(contact);
        this.logger.log({
            payload: {
                step: 'end',
                message: 'after update',
                method: 'HubspotController@createOrUpdateContact',
                executedBy: customer,
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        return createOrUpdateContact;
    }
    UpdateCreditsAndPackages(data) {
        return this.hubspotService.updateCreditsAndPackages(data);
    }
    addContactToWorkFlow(data) {
        return this.hubspotService.addContactToWorkFlow(data);
    }
    updateContactByTicketId(id, contact) {
        return this.hubspotService.updateContactByTicketId(id, contact);
    }
    async getContactDetailsByEmail(contactEmail) {
        return this.hubspotService.getContactDetailsByEmail(contactEmail);
    }
    async isAdmin(email) {
        const isAdmin = await this.hubspotService.isAdminByEmail(email);
        return { isAdmin };
    }
    async updateAfyPassword(customer, dto) {
        this.logger.log({
            payload: {
                step: 'start',
                message: 'before update',
                method: 'HubspotController@updateAfyPassword',
                executedBy: customer,
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        const updateAfyPassword = await this.hubspotService.updateAfyPassword(dto);
        this.logger.log({
            payload: {
                step: 'end',
                message: 'after update',
                method: 'HubspotController@updateAfyPassword',
                executedBy: customer,
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_HUBSPOT_PASSWORD);
        return updateAfyPassword;
    }
    updateProfileAvatar(dto) {
        return this.hubspotService.updateProfileAvatar(dto);
    }
    async getAllBlogPosts() {
        return this.hubspotService.getAllBlogPosts();
    }
    async autoEnrollHsContactWorkflow(data) {
        return this.hubspotService.getListContactsWithWorkflow(data);
    }
    async verifyHubspotProduct(body) {
        return this.hubspotService.verifyProduct(body);
    }
    async submitHSForms(dto) {
        return this.hubspotService.submitHSForms(dto);
    }
};
__decorate([
    (0, common_1.Post)('meeting'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HubspotController.prototype, "register", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.Post)('ticket'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTicket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", void 0)
], HubspotController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Post)('/auto-login-token'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HubspotController.prototype, "getAutoLoginToken", null);
__decorate([
    (0, common_1.Post)('/authenticate'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HubspotController.prototype, "authenticate", null);
__decorate([
    (0, common_1.Post)('/contact'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, contact_dto_1.ContactDto]),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "createOrUpdateContact", null);
__decorate([
    (0, common_1.Post)('/contact/packagesandcredits'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateCreditsAndPackages_dto_1.UpdateCreditsAndPackagesDto]),
    __metadata("design:returntype", void 0)
], HubspotController.prototype, "UpdateCreditsAndPackages", null);
__decorate([
    (0, common_1.Post)('/contact/workflow'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addContactToWorkFlow_dto_1.AddContactToWorkFlowDto]),
    __metadata("design:returntype", void 0)
], HubspotController.prototype, "addContactToWorkFlow", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.Patch)('/contact/:ticketId'),
    __param(0, (0, common_1.Param)('ticketId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_contact_dto_1.UpdateContactDto]),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "updateContactByTicketId", null);
__decorate([
    (0, common_1.Get)('/contact/:contactEmail'),
    __param(0, (0, common_1.Param)('contactEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "getContactDetailsByEmail", null);
__decorate([
    (0, common_1.Get)('/customer-is-admin/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "isAdmin", null);
__decorate([
    (0, common_1.Post)('/update-afy-password'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe, validate_password_confirmation_pipe_1.ValidatePasswordConfirmationPipe, transform_password_encrypted_pipe_1.TransformPasswordEncryptedPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, contact_dto_1.UpdateAfyPasswordDto]),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "updateAfyPassword", null);
__decorate([
    (0, common_1.Post)('/update-profile-avatar'),
    __param(0, (0, common_1.Body)(transform_password_encrypted_pipe_1.TransformPasswordEncryptedPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_dto_1.UpdateProfileAvatarDto]),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "updateProfileAvatar", null);
__decorate([
    (0, common_1.Get)('/blog-posts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "getAllBlogPosts", null);
__decorate([
    (0, common_1.Post)('auto-enroll-hs-contact-workflow'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addContactToWorkFlow_dto_1.ContactToWorkFlowDto]),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "autoEnrollHsContactWorkflow", null);
__decorate([
    (0, common_1.Post)('verify-product'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [products_dto_1.VerifyProductDto]),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "verifyHubspotProduct", null);
__decorate([
    (0, common_1.Post)('submit-form'),
    __param(0, (0, common_1.Body)(validation_transform_pipe_1.ValidationTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_submission_dto_1.FormSubmissionDto]),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "submitHSForms", null);
HubspotController = __decorate([
    (0, common_1.Controller)({ path: 'hubspot', version: '1' }),
    __metadata("design:paramtypes", [hubspot_service_1.HubspotService,
        common_1.Logger])
], HubspotController);
exports.HubspotController = HubspotController;
//# sourceMappingURL=hubspot.controller.js.map