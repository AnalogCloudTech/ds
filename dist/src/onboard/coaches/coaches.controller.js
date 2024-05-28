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
exports.CoachesController = void 0;
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
const coaches_service_1 = require("./coaches.service");
const common_1 = require("@nestjs/common");
const coach_1 = require("./domain/coach");
const create_coach_dto_1 = require("./dto/create-coach.dto");
const update_coach_dto_1 = require("./dto/update-coach.dto");
const email_lower_case_pipe_1 = require("../../internal/common/pipes/email-lower-case.pipe");
const paginator_1 = require("../../internal/utils/paginator");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
let CoachesController = class CoachesController {
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
        throw new common_1.UnauthorizedException({
            message: 'You are not allowed to delete a coach',
        });
    }
    update(id, body) {
        return this.service.update(id, body);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(coach_1.CoachDomain),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], CoachesController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(coach_1.CoachDomain),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoachesController.prototype, "findOne", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(coach_1.CoachDomain),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)(email_lower_case_pipe_1.EmailLowerCasePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_coach_dto_1.CreateCoachDto]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "register", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(coach_1.CoachDomain),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "remove", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(coach_1.CoachDomain),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_coach_dto_1.UpdateCoachDto]),
    __metadata("design:returntype", void 0)
], CoachesController.prototype, "update", null);
CoachesController = __decorate([
    (0, common_1.Controller)({ path: 'coaches', version: '1' }),
    __metadata("design:paramtypes", [coaches_service_1.CoachesService])
], CoachesController);
exports.CoachesController = CoachesController;
//# sourceMappingURL=coaches.controller.js.map