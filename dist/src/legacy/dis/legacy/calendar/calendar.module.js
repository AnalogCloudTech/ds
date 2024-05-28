"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarModule = void 0;
const common_1 = require("@nestjs/common");
const calendar_service_1 = require("./calendar.service");
const google_module_1 = require("../google/google.module");
const hubspot_module_1 = require("../hubspot/hubspot.module");
const config_1 = require("@nestjs/config");
let CalendarModule = class CalendarModule {
};
CalendarModule = __decorate([
    (0, common_1.Module)({
        imports: [google_module_1.GoogleModule, hubspot_module_1.HubspotModule],
        exports: [calendar_service_1.CalendarService],
        providers: [
            calendar_service_1.CalendarService,
            {
                inject: [config_1.ConfigService],
                provide: 'SCHEDULE_COACH_DURATION',
                useFactory: (configService) => {
                    return configService.get('onboardSettings.scheduleCoachDuration');
                },
            },
        ],
    })
], CalendarModule);
exports.CalendarModule = CalendarModule;
//# sourceMappingURL=calendar.module.js.map