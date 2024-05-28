"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagevisitsModule = void 0;
const common_1 = require("@nestjs/common");
const pagevisits_service_1 = require("./pagevisits.service");
const pagevisits_controller_1 = require("./pagevisits.controller");
const mongoose_1 = require("@nestjs/mongoose");
const cms_module_1 = require("../cms/cms/cms.module");
const segments_module_1 = require("../campaigns/email-campaigns/segments/segments.module");
const pagevisits_schema_1 = require("./schemas/pagevisits.schema");
const pagevisits_repository_1 = require("./repository/pagevisits.repository");
let PagevisitsModule = class PagevisitsModule {
};
PagevisitsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: pagevisits_schema_1.Pagevisits.name, schema: pagevisits_schema_1.PagevisitsSchema },
            ]),
            cms_module_1.CmsModule,
            segments_module_1.SegmentsModule,
        ],
        controllers: [pagevisits_controller_1.PagevisitsController],
        providers: [pagevisits_repository_1.PagevisitsRepository, pagevisits_service_1.PagevisitsService],
        exports: [mongoose_1.MongooseModule, pagevisits_service_1.PagevisitsService, pagevisits_repository_1.PagevisitsRepository],
    })
], PagevisitsModule);
exports.PagevisitsModule = PagevisitsModule;
//# sourceMappingURL=pagevisits.module.js.map