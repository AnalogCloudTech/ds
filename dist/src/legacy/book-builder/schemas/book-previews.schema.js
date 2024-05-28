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
exports.BookPreviewsSchema = exports.BookPreviews = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let BookPreviews = class BookPreviews {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], BookPreviews.prototype, "bookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BookPreviews.prototype, "bookTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BookPreviews.prototype, "pdfUrl", void 0);
BookPreviews = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__book_previews',
    })
], BookPreviews);
exports.BookPreviews = BookPreviews;
exports.BookPreviewsSchema = mongoose_1.SchemaFactory.createForClass(BookPreviews);
//# sourceMappingURL=book-previews.schema.js.map