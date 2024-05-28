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
exports.BookPreviewsController = void 0;
const book_previews_service_1 = require("../services/book-previews.service");
const common_1 = require("@nestjs/common");
const create_book_previews_dto_1 = require("../dto/create-book-previews.dto");
const paginator_1 = require("../../../internal/utils/paginator");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const BookPreviews_1 = require("../domain/BookPreviews");
const update_book_previews_dto_1 = require("../dto/update-book-previews.dto");
let BookPreviewsController = class BookPreviewsController {
    constructor(bookPreviewsService) {
        this.bookPreviewsService = bookPreviewsService;
    }
    create(dto) {
        return this.bookPreviewsService.create(dto);
    }
    findAll({ page = 0, perPage = 15 }) {
        return this.bookPreviewsService.find({}, { skip: page * perPage, limit: perPage });
    }
    delete(id) {
        return this.bookPreviewsService.delete(id);
    }
    update(id, dto) {
        return this.bookPreviewsService.update(id, dto);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_previews_dto_1.CreateBookPreviewsDto]),
    __metadata("design:returntype", Promise)
], BookPreviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, serialize_interceptor_1.Serialize)(BookPreviews_1.BookPreviewsDomain),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator]),
    __metadata("design:returntype", void 0)
], BookPreviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, serialize_interceptor_1.Serialize)(BookPreviews_1.BookPreviewsDomain),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookPreviewsController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, serialize_interceptor_1.Serialize)(BookPreviews_1.BookPreviewsDomain),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_book_previews_dto_1.UpdateBookPreviewsDto]),
    __metadata("design:returntype", void 0)
], BookPreviewsController.prototype, "update", null);
BookPreviewsController = __decorate([
    (0, common_1.Controller)({ path: 'book-previews', version: '1' }),
    __metadata("design:paramtypes", [book_previews_service_1.BookPreviewsService])
], BookPreviewsController);
exports.BookPreviewsController = BookPreviewsController;
//# sourceMappingURL=book-previews.controller.js.map