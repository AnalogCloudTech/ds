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
exports.BookCreditSchema = exports.BookCreditsOption = void 0;
const product_schema_1 = require("../../onboard/products/schemas/product.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_credits_1 = require("../domain/book-credits");
let BookCreditsOption = class BookCreditsOption {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BookCreditsOption.prototype, "credits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BookCreditsOption.prototype, "perAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BookCreditsOption.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], BookCreditsOption.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, enum: book_credits_1.CreditType }),
    __metadata("design:type", String)
], BookCreditsOption.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: product_schema_1.Product.name, type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", Object)
], BookCreditsOption.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, Type: String }),
    __metadata("design:type", String)
], BookCreditsOption.prototype, "savings", void 0);
BookCreditsOption = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__onboard__book_credits' })
], BookCreditsOption);
exports.BookCreditsOption = BookCreditsOption;
exports.BookCreditSchema = mongoose_1.SchemaFactory.createForClass(BookCreditsOption);
//# sourceMappingURL=book-credits.schema.js.map