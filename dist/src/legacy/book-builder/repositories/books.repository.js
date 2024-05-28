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
exports.BooksRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_schema_1 = require("../schemas/book.schema");
let BooksRepository = class BooksRepository {
    constructor(model) {
        this.model = model;
    }
    create(dto) {
        return new this.model(dto).save();
    }
    find(filter, options = { skip: 0, limit: 15, lean: true }) {
        return this.model.find(filter, {}, options).exec();
    }
    findOne(filter, options = { lean: true }) {
        return this.model.findOne(filter, {}, options).exec();
    }
    async delete(filter) {
        const book = await this.model.findOneAndDelete(filter).exec();
        if (!book) {
            throw new common_1.HttpException({ message: 'book not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return book;
    }
    async update(filter, update, options = { lean: true, new: true }) {
        const book = await this.model
            .findOneAndUpdate(filter, update, options)
            .exec();
        if (!book) {
            throw new common_1.HttpException({ message: 'book not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return book;
    }
};
BooksRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_schema_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BooksRepository);
exports.BooksRepository = BooksRepository;
//# sourceMappingURL=books.repository.js.map