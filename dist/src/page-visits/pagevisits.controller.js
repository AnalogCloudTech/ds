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
exports.PagevisitsController = void 0;
const common_1 = require("@nestjs/common");
const pagevisits_service_1 = require("./pagevisits.service");
const create_pagevisits_from_pagestead_dto_1 = require("./dto/create-pagevisits-from-pagestead.dto");
const customer_email_lower_case_pipe_1 = require("../internal/common/pipes/customer-email-lower-case.pipe");
const auth_service_1 = require("../auth/auth.service");
let PagevisitsController = class PagevisitsController {
    constructor(pagevisitsService) {
        this.pagevisitsService = pagevisitsService;
    }
    async createPageVisitsFromPagestead(createPageVisitsFromPagesteadDto) {
        return this.pagevisitsService.createVisits(createPageVisitsFromPagesteadDto);
    }
};
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Post)('create-pagevisits'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe, customer_email_lower_case_pipe_1.CustomerEmailLowerCasePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pagevisits_from_pagestead_dto_1.CreatePageVisitsFromPagesteadDto]),
    __metadata("design:returntype", Promise)
], PagevisitsController.prototype, "createPageVisitsFromPagestead", null);
PagevisitsController = __decorate([
    (0, common_1.Controller)({ path: 'page-visits', version: '1' }),
    __metadata("design:paramtypes", [pagevisits_service_1.PagevisitsService])
], PagevisitsController);
exports.PagevisitsController = PagevisitsController;
//# sourceMappingURL=pagevisits.controller.js.map