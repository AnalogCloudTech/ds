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
exports.BooksService = void 0;
const books_repository_1 = require("../repositories/books.repository");
const common_1 = require("@nestjs/common");
let BooksService = class BooksService {
    constructor(booksRepository) {
        this.booksRepository = booksRepository;
    }
    create(dto, customer) {
        return this.booksRepository.create(Object.assign(Object.assign({}, dto), { customer: customer._id }));
    }
    find(filter, options, customer) {
        if (customer) {
            filter['customerId'] = customer._id;
        }
        return this.booksRepository.find(filter, options);
    }
    findOne(filter, customer) {
        if (customer) {
            filter['customerId'] = customer._id;
        }
        return this.booksRepository.findOne(filter);
    }
    delete(filter, customer) {
        if (customer) {
            filter['customerId'] = customer._id;
        }
        return this.booksRepository.delete(filter);
    }
    update(filter, dto, customer) {
        if (customer) {
            filter['customerId'] = customer._id;
        }
        return this.booksRepository.update(filter, dto);
    }
};
BooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [books_repository_1.BooksRepository])
], BooksService);
exports.BooksService = BooksService;
//# sourceMappingURL=books.service.js.map