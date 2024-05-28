"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DentistCoachesModule = void 0;
const common_1 = require("@nestjs/common");
const dentist_coaches_service_1 = require("./dentist-coaches.service");
const dentist_coaches_controller_1 = require("./dentist-coaches.controller");
const mongoose_1 = require("@nestjs/mongoose");
const dentist_coach_schema_1 = require("./schemas/dentist-coach.schema");
const email_reminders_module_1 = require("../email-reminders/email-reminders.module");
let DentistCoachesModule = class DentistCoachesModule {
};
DentistCoachesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: dentist_coach_schema_1.DentistCoach.name, schema: dentist_coach_schema_1.DentistCoachSchema },
            ]),
            (0, common_1.forwardRef)(() => email_reminders_module_1.EmailRemindersModule),
        ],
        providers: [dentist_coaches_service_1.DentistCoachesService],
        controllers: [dentist_coaches_controller_1.DentistCoachesController],
        exports: [dentist_coaches_service_1.DentistCoachesService],
    })
], DentistCoachesModule);
exports.DentistCoachesModule = DentistCoachesModule;
//# sourceMappingURL=dentist-coaches.module.js.map