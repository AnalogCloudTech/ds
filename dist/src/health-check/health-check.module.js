"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckModule = void 0;
const common_1 = require("@nestjs/common");
const health_check_service_1 = require("./health-check.service");
const health_check_controller_1 = require("./health-check.controller");
const cms_module_1 = require("../cms/cms/cms.module");
const generate_book_module_1 = require("../onboard/generate-book/generate-book.module");
const analytics_module_1 = require("../legacy/dis/legacy/analytics/analytics.module");
let HealthCheckModule = class HealthCheckModule {
};
HealthCheckModule = __decorate([
    (0, common_1.Module)({
        imports: [cms_module_1.CmsModule, generate_book_module_1.GenerateBookModule, analytics_module_1.AnalyticsModule],
        controllers: [health_check_controller_1.HealthCheckController],
        providers: [health_check_service_1.HealthCheckService],
    })
], HealthCheckModule);
exports.HealthCheckModule = HealthCheckModule;
//# sourceMappingURL=health-check.module.js.map