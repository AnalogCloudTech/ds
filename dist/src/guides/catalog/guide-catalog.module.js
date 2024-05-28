"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideCatalogModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const guide_catalog_schema_1 = require("./schemas/guide-catalog.schema");
const guide_catalog_service_1 = require("./guide-catalog.service");
const guide_catalog_repository_1 = require("./repositories/guide-catalog.repository");
const guide_catalog_controller_1 = require("./guide-catalog.controller");
let GuideCatalogModule = class GuideCatalogModule {
};
GuideCatalogModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: guide_catalog_schema_1.GuideCatalog.name, schema: guide_catalog_schema_1.GuideCatalogSchema },
            ]),
        ],
        providers: [guide_catalog_service_1.GuideCatalogService, guide_catalog_repository_1.GuideCatalogRepository],
        controllers: [guide_catalog_controller_1.GuideCatalogController],
        exports: [guide_catalog_service_1.GuideCatalogService, guide_catalog_repository_1.GuideCatalogRepository],
    })
], GuideCatalogModule);
exports.GuideCatalogModule = GuideCatalogModule;
//# sourceMappingURL=guide-catalog.module.js.map