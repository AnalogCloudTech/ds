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
exports.EmailHistoryController = void 0;
const auth_service_1 = require("../../../auth/auth.service");
const paginator_1 = require("../../../internal/utils/paginator");
const common_1 = require("@nestjs/common");
const email_history_service_1 = require("./email-history.service");
const parse_sns_response_1 = require("./utils/parse-sns-response");
const filters_pipe_1 = require("./pipes/filters/filters.pipe");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const email_history_1 = require("./domain/email-history");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../internal/common/contexts");
let EmailHistoryController = class EmailHistoryController {
    constructor(emailHistoryService, logger) {
        this.emailHistoryService = emailHistoryService;
        this.logger = logger;
    }
    async index(req, id) {
        return this.emailHistoryService.getEmailHistory(req.user, id);
    }
    list(req, { page, perPage }, { status, type }) {
        return this.emailHistoryService.listEmailHistory(req.user, page, perPage, status, type);
    }
    async listByLead(req, leadId, { page, perPage }, { status, types }) {
        return this.emailHistoryService.getEmailHistoryByLead(req.user, leadId, page, perPage, status, types);
    }
    async create(req) {
        try {
            const data = await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject('timeout request'), 5000);
                let data = '';
                req.on('data', (chunk) => {
                    data += chunk;
                });
                req.on('end', () => {
                    const parsedData = (0, parse_sns_response_1.default)(data);
                    clearTimeout(timeout);
                    resolve(parsedData);
                });
                req.on('error', (err) => {
                    reject(err);
                });
            });
            if (!data || !(data === null || data === void 0 ? void 0 : data.eventType)) {
                this.logger.log({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        snsData: data,
                    },
                    CONTEXT_EMAIL_HISTORY: contexts_1.CONTEXT_EMAIL_HISTORY,
                });
                throw new common_1.HttpException({
                    message: 'failed to load data from SNS',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            this.logger.log({
                payload: {
                    message: 'creating email history from raw data',
                    rawData: data,
                },
            });
            return this.emailHistoryService.createFromSNS(data);
        }
        catch (err) {
            throw new common_1.HttpException({
                message: err,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmailHistoryController.prototype, "index", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(email_history_1.EmailHistory),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __param(2, (0, common_1.Query)(filters_pipe_1.default)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginator_1.Paginator, Object]),
    __metadata("design:returntype", void 0)
], EmailHistoryController.prototype, "list", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(email_history_1.EmailHistory),
    (0, common_1.Get)('lead/:lead'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('lead')),
    __param(2, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __param(3, (0, common_1.Query)(filters_pipe_1.default)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, paginator_1.Paginator, Object]),
    __metadata("design:returntype", Promise)
], EmailHistoryController.prototype, "listByLead", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailHistoryController.prototype, "create", null);
EmailHistoryController = __decorate([
    (0, common_1.Controller)({
        path: 'email-campaigns/email-history',
        version: '1',
    }),
    __param(1, (0, common_1.Inject)('logger')),
    __metadata("design:paramtypes", [email_history_service_1.EmailHistoryService,
        common_1.Logger])
], EmailHistoryController);
exports.EmailHistoryController = EmailHistoryController;
//# sourceMappingURL=email-history.controller.js.map