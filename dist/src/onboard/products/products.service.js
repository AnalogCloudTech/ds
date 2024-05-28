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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_repository_1 = require("./repositories/products.repository");
const products_integrations_repository_1 = require("./repositories/products-integrations.repository");
const luxon_1 = require("luxon");
const contexts_1 = require("../../internal/common/contexts");
let ProductsService = class ProductsService {
    constructor(productsRepository, productsIntegrationsRepository, logger) {
        this.productsRepository = productsRepository;
        this.productsIntegrationsRepository = productsIntegrationsRepository;
        this.logger = logger;
    }
    create(dto) {
        return this.productsRepository.create(dto);
    }
    getAllProducts(page, perPage, searchQuery) {
        return this.productsRepository.findAll(page, perPage, searchQuery);
    }
    async getProductById(id) {
        const product = await this.productsRepository.findOne(id);
        if (!product) {
            throw new common_1.HttpException({
                message: 'Product details not found',
                method: 'get',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        return product;
    }
    async updateProductById(id, dto) {
        const product = await this.productsRepository.update(id, dto);
        if (!product) {
            throw new common_1.HttpException({
                message: 'Product not found',
                method: 'get',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        return product;
    }
    async deleteProductById(id) {
        const product = await this.productsRepository.remove(id);
        if (!product) {
            throw new common_1.HttpException({
                message: 'Product not found',
                method: 'get',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        return product;
    }
    async findIntegrationProductByChargifyId(chargifyId) {
        return this.productsIntegrationsRepository.findByChargifyId(chargifyId);
    }
    async findProductByChargifyId(chargifyId) {
        return this.productsRepository.findProductByChargifyId(chargifyId);
    }
    async find(query) {
        return this.productsRepository.find(query);
    }
    async patchProductsWithIntegrationData() {
        const products = await this.productsRepository.getProductsNeedToBeSynced();
        for (const prod of products) {
            const integrationProduct = await this.findIntegrationProductByChargifyId(prod.chargifyComponentId);
            const { productProperty, priceProperty, value, credits_once, credits_recur, book_packages, product, } = integrationProduct;
            if (integrationProduct) {
                const updatedProduct = await this.productsRepository.update(prod._id.toString(), {
                    productProperty,
                    priceProperty,
                    creditsOnce: credits_once,
                    creditsRecur: credits_recur,
                    bookPackages: book_packages,
                    product,
                    value: Number(value),
                });
                this.logger.log({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        message: `Product ${updatedProduct._id} synced`,
                    },
                }, contexts_1.CONTEXT_PRODUCT_SERVICE);
            }
            else {
                if (!product) {
                    throw new common_1.HttpException({
                        message: `Product ${prod._id} not synced (integration product not found)`,
                    }, common_1.HttpStatus.NOT_FOUND);
                }
            }
        }
    }
    async findAllProducts(page, perPage) {
        return this.productsIntegrationsRepository.findAll(page, perPage);
    }
    getProductByStripeId(stripeId) {
        return this.productsRepository.findProductByStripeId(stripeId);
    }
};
ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository,
        products_integrations_repository_1.ProductsIntegrationsRepository,
        common_1.Logger])
], ProductsService);
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map