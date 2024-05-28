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
exports.BooksController = void 0;
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const paginator_1 = require("../../../internal/utils/paginator");
const common_1 = require("@nestjs/common");
const book_1 = require("../domain/book");
const create_book_dto_1 = require("../dto/create-book.dto");
const books_service_1 = require("../services/books.service");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
let BooksController = class BooksController {
    constructor(booksService) {
        this.booksService = booksService;
    }
    create(dto, customer) {
        return this.booksService.create(dto, customer);
    }
    findAll(customer, { page = 0, perPage = 15 }) {
        return this.booksService.find({}, { skip: page * perPage, limit: perPage }, customer);
    }
    delete(id, customer) {
        return this.booksService.delete({ _id: id }, customer);
    }
    update(id, dto, customer) {
        return this.booksService.update({ _id: id }, dto, customer);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, serialize_interceptor_1.Serialize)(book_1.BookDomain),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_dto_1.CreateBookDto, Object]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, serialize_interceptor_1.Serialize)(book_1.BookDomain),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginator_1.Paginator]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, serialize_interceptor_1.Serialize)(book_1.BookDomain),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, serialize_interceptor_1.Serialize)(book_1.BookDomain),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "update", null);
BooksController = __decorate([
    (0, common_1.Controller)({ path: 'books', version: '1' }),
    __metadata("design:paramtypes", [books_service_1.BooksService])
], BooksController);
exports.BooksController = BooksController;
//# sourceMappingURL=books.controller.js.map