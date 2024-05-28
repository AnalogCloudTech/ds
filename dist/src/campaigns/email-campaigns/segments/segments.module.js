"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentsModule = void 0;
const common_1 = require("@nestjs/common");
const segments_controller_1 = require("./segments.controller");
const cms_module_1 = require("../../../cms/cms/cms.module");
const segments_service_1 = require("./segments.service");
const leads_module_1 = require("../leads/leads.module");
let SegmentsModule = class SegmentsModule {
};
SegmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [cms_module_1.CmsModule, (0, common_1.forwardRef)(() => leads_module_1.LeadsModule)],
        controllers: [segments_controller_1.SegmentsController],
        providers: [segments_service_1.SegmentsService, common_1.Logger],
        exports: [segments_service_1.SegmentsService],
    })
], SegmentsModule);
exports.SegmentsModule = SegmentsModule;
//# sourceMappingURL=segments.module.js.map