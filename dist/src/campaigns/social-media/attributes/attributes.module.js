"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributesModule = void 0;
const common_1 = require("@nestjs/common");
const attributes_service_1 = require("./attributes.service");
const attributes_controller_1 = require("./attributes.controller");
const mongoose_1 = require("@nestjs/mongoose");
const attributes_1 = require("../../../customers/customers/domain/attributes");
const attributes_schemas_1 = require("./schemas/attributes.schemas");
let AttributesModule = class AttributesModule {
};
AttributesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: attributes_1.Attributes.name, schema: attributes_schemas_1.AttributeSchema },
            ]),
        ],
        controllers: [attributes_controller_1.AttributesController],
        providers: [attributes_service_1.AttributesService],
    })
], AttributesModule);
exports.AttributesModule = AttributesModule;
//# sourceMappingURL=attributes.module.js.map