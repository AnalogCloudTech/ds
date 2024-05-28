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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const paginator_1 = require("../../internal/utils/paginator");
const product_1 = require("./domain/product");
const create_products_dto_1 = require("./dto/create-products.dto");
const products_service_1 = require("./products.service");
const is_admin_guard_1 = require("../../internal/common/guards/is-admin.guard");
const update_products_dto_1 = require("./dto/update-products.dto");
const product_search_dto_1 = require("../../referral-marketing/magazines/dto/product-search.dto");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
let ProductsController = class ProductsController {
    constructor(service) {
        this.service = service;
    }
    async register(body) {
        const result = await this.service.create(body);
        return result.castTo(product_1.Product);
    }
    async getAllProducts({ page, perPage }, { searchQuery }) {
        return this.service.getAllProducts(page, perPage, searchQuery);
    }
    async getProductById(id) {
        return this.service.getProductById(id);
    }
    async updateProductById(id, dto) {
        return this.service.updateProductById(id, dto);
    }
    async deleteProductById(id) {
        return this.service.deleteProductById(id);
    }
    async findAllProducts({ page, perPage }) {
        return this.service.findAllProducts(page, perPage);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_products_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "register", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        product_search_dto_1.ProductSearchtDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_products_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProductById", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProductById", null);
__decorate([
    (0, common_1.Get)('/config/all'),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAllProducts", null);
ProductsController = __decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Controller)({ path: 'products', version: '1' }),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map