"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentsModule = void 0;
const common_1 = require("@nestjs/common");
const contents_controller_1 = require("./contents.controller");
const contents_service_1 = require("./contents.service");
const cms_module_1 = require("../../../cms/cms/cms.module");
const ses_module_1 = require("../../../internal/libs/aws/ses/ses.module");
let ContentsModule = class ContentsModule {
};
ContentsModule = __decorate([
    (0, common_1.Module)({
        imports: [cms_module_1.CmsModule, ses_module_1.SesModule],
        controllers: [contents_controller_1.ContentsController],
        providers: [contents_service_1.ContentsService, common_1.Logger],
        exports: [contents_service_1.ContentsService],
    })
], ContentsModule);
exports.ContentsModule = ContentsModule;
//# sourceMappingURL=contents.module.js.map