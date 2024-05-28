"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("./schemas/product.schema");
const products_repository_1 = require("./repositories/products.repository");
const products_integrations_repository_1 = require("./repositories/products-integrations.repository");
const product_integrations_schema_1 = require("./schemas/product-integrations.schema");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
let ProductsModule = class ProductsModule {
};
ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: product_integrations_schema_1.ProductIntegration.name, schema: product_integrations_schema_1.ProductIntegrationSchema },
            ]),
            hubspot_module_1.HubspotModule,
        ],
        providers: [
            common_1.Logger,
            config_1.ConfigService,
            products_service_1.ProductsService,
            products_repository_1.ProductsRepository,
            products_integrations_repository_1.ProductsIntegrationsRepository,
        ],
        controllers: [products_controller_1.ProductsController],
        exports: [mongoose_1.MongooseModule, products_service_1.ProductsService],
    })
], ProductsModule);
exports.ProductsModule = ProductsModule;
//# sourceMappingURL=products.module.js.map