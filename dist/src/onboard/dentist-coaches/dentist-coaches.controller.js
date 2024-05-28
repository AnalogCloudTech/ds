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
exports.DentistCoachesController = void 0;
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
const common_1 = require("@nestjs/common");
const dentist_coach_1 = require("./domain/dentist-coach");
const create_dentist_coach_dto_1 = require("./dto/create-dentist-coach.dto");
const update_dentist_coach_dto_1 = require("./dto/update-dentist-coach.dto");
const email_lower_case_pipe_1 = require("../../internal/common/pipes/email-lower-case.pipe");
const paginator_1 = require("../../internal/utils/paginator");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
const dentist_coaches_service_1 = require("./dentist-coaches.service");
let DentistCoachesController = class DentistCoachesController {
    constructor(service) {
        this.service = service;
    }
    async findAll({ page, perPage }) {
        return this.service.findAllPaginated(page, perPage);
    }
    async findOne(id) {
        return this.service.findOne(id);
    }
    register(body) {
        return this.service.create(body);
    }
    remove(id) {
        return this.service.remove(id);
    }
    update(id, body) {
        return this.service.update(id, body);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(dentist_coach_1.DentistCoachDomain),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], DentistCoachesController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(dentist_coach_1.DentistCoachDomain),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DentistCoachesController.prototype, "findOne", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(dentist_coach_1.DentistCoachDomain),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)(email_lower_case_pipe_1.EmailLowerCasePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dentist_coach_dto_1.CreateDentistCoachDto]),
    __metadata("design:returntype", void 0)
], DentistCoachesController.prototype, "register", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(dentist_coach_1.DentistCoachDomain),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DentistCoachesController.prototype, "remove", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(dentist_coach_1.DentistCoachDomain),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dentist_coach_dto_1.UpdateDentistCoachDto]),
    __metadata("design:returntype", void 0)
], DentistCoachesController.prototype, "update", null);
DentistCoachesController = __decorate([
    (0, common_1.Controller)({ path: 'dentist-coaches', version: '1' }),
    __metadata("design:paramtypes", [dentist_coaches_service_1.DentistCoachesService])
], DentistCoachesController);
exports.DentistCoachesController = DentistCoachesController;
//# sourceMappingURL=dentist-coaches.controller.js.map