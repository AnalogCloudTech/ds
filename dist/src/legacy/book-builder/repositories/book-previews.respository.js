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
exports.BookPreviewsRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const book_previews_schema_1 = require("../schemas/book-previews.schema");
const mongoose_2 = require("mongoose");
const generic_repository_1 = require("../../../internal/common/repository/generic.repository");
let BookPreviewsRepository = class BookPreviewsRepository extends generic_repository_1.GenericRepository {
    constructor(model) {
        super(model);
        this.model = model;
    }
};
BookPreviewsRepository = __decorate([
    __param(0, (0, mongoose_1.InjectModel)(book_previews_schema_1.BookPreviews.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BookPreviewsRepository);
exports.BookPreviewsRepository = BookPreviewsRepository;
//# sourceMappingURL=book-previews.respository.js.map