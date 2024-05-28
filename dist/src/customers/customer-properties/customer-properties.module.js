"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerPropertiesModule = void 0;
const common_1 = require("@nestjs/common");
const customer_properties_service_1 = require("./customer-properties.service");
const cms_module_1 = require("../../cms/cms/cms.module");
const mongoose_1 = require("@nestjs/mongoose");
const customer_properties_schemas_1 = require("./schemas/customer-properties.schemas");
const customer_properties_controller_1 = require("./customer-properties.controller");
const customer_properties_repository_1 = require("./repositories/customer-properties.repository");
let CustomerPropertiesModule = class CustomerPropertiesModule {
};
CustomerPropertiesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: customer_properties_schemas_1.CustomerProperties.name, schema: customer_properties_schemas_1.CustomerPropertiesSchema },
            ]),
            cms_module_1.CmsModule,
        ],
        providers: [customer_properties_service_1.CustomerPropertiesService, customer_properties_repository_1.CustomerPropertiesRepository, common_1.Logger],
        controllers: [customer_properties_controller_1.CustomerPropertiesController],
        exports: [customer_properties_service_1.CustomerPropertiesService],
    })
], CustomerPropertiesModule);
exports.CustomerPropertiesModule = CustomerPropertiesModule;
//# sourceMappingURL=customer-properties.module.js.map