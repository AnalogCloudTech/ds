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
exports.BookCreditsController = void 0;
const common_1 = require("@nestjs/common");
const is_admin_guard_1 = require("../internal/common/guards/is-admin.guard");
const create_book_credits_dto_1 = require("./dto/create-book-credits.dto");
const book_credits_service_1 = require("./book-credits.service");
const update_book_credits_dto_1 = require("./dto/update-book-credits.dto");
const serialize_interceptor_1 = require("../internal/common/interceptors/serialize.interceptor");
const book_credits_1 = require("./domain/book-credits");
let BookCreditsController = class BookCreditsController {
    constructor(bookCreditsService) {
        this.bookCreditsService = bookCreditsService;
    }
    createBookCredit(credits) {
        return this.bookCreditsService.create(credits);
    }
    getBookCredit(type) {
        return this.bookCreditsService.getAllBookCredit(type);
    }
    getBookCreditById(id) {
        return this.bookCreditsService.getBookCreditById(id);
    }
    updateBookCredit(id, credits) {
        return this.bookCreditsService.updateBookCredit(id, credits);
    }
    deleteBookCredit(id) {
        return this.bookCreditsService.deleteBookCredit(id);
    }
};
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, serialize_interceptor_1.Serialize)(book_credits_1.BookCredits),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_credits_dto_1.CreateBookCreditsDto]),
    __metadata("design:returntype", Promise)
], BookCreditsController.prototype, "createBookCredit", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(book_credits_1.BookCredits),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookCreditsController.prototype, "getBookCredit", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(book_credits_1.BookCredits),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookCreditsController.prototype, "getBookCreditById", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(book_credits_1.BookCredits),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Patch)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_book_credits_dto_1.UpdateBookCreditsDto]),
    __metadata("design:returntype", Promise)
], BookCreditsController.prototype, "updateBookCredit", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(book_credits_1.BookCredits),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookCreditsController.prototype, "deleteBookCredit", null);
BookCreditsController = __decorate([
    (0, common_1.Controller)({ path: 'book-credits', version: '1' }),
    __metadata("design:paramtypes", [book_credits_service_1.BookCreditsService])
], BookCreditsController);
exports.BookCreditsController = BookCreditsController;
//# sourceMappingURL=book-credits.controller.js.map