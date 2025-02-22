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
exports.ContentsController = void 0;
const common_1 = require("@nestjs/common");
const contents_service_1 = require("./contents.service");
const paginator_1 = require("../../../internal/utils/paginator");
let ContentsController = class ContentsController {
    constructor(contentsServiceService) {
        this.contentsServiceService = contentsServiceService;
    }
    show(contentId) {
        return this.contentsServiceService.details(contentId);
    }
    list({ page, perPage: pageSize }) {
        const query = {
            pagination: {
                page,
                pageSize,
            },
        };
        return this.contentsServiceService.list(query);
    }
};
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContentsController.prototype, "show", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator]),
    __metadata("design:returntype", void 0)
], ContentsController.prototype, "list", null);
ContentsController = __decorate([
    (0, common_1.Controller)({ path: 'social-media/contents', version: '1' }),
    __metadata("design:paramtypes", [contents_service_1.ContentsService])
], ContentsController);
exports.ContentsController = ContentsController;
//# sourceMappingURL=contents.controller.js.map