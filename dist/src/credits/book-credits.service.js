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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCreditsService = void 0;
const common_1 = require("@nestjs/common");
const book_credits_repository_1 = require("./book-credits.repository");
const book_credits_1 = require("./domain/book-credits");
let BookCreditsService = class BookCreditsService {
    constructor(bookCreditsRepository) {
        this.bookCreditsRepository = bookCreditsRepository;
    }
    async create(credits) {
        return this.bookCreditsRepository.store(credits);
    }
    async getAllBookCredit(type = book_credits_1.CreditType.Book) {
        const filter = {
            type,
        };
        return this.bookCreditsRepository.findAggregate(filter);
    }
    async getBookCreditById(id) {
        return this.bookCreditsRepository.findById(id);
    }
    async updateBookCredit(id, data) {
        return this.bookCreditsRepository.update(id, data);
    }
    async deleteBookCredit(id) {
        return this.bookCreditsRepository.delete(id);
    }
};
BookCreditsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [book_credits_repository_1.BookCreditsRepository])
], BookCreditsService);
exports.BookCreditsService = BookCreditsService;
//# sourceMappingURL=book-credits.service.js.map