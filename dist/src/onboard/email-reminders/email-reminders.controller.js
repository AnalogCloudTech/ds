"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailRemindersController = void 0;
const common_1 = require("@nestjs/common");
const email_reminders_service_1 = require("./email-reminders.service");
const reschedule_reminders_dto_1 = require("./dto/reschedule-reminders.dto");
const is_admin_guard_1 = require("../../internal/common/guards/is-admin.guard");
let EmailRemindersController = class EmailRemindersController {
    constructor(emailRemindersService) {
        this.emailRemindersService = emailRemindersService;
    }
    getRemindersFromCustomer(email) {
        return this.emailRemindersService.getRemindersFromCustomer(email);
    }
    rescheduleReminders(rescheduleRemindersDto) {
        return this.emailRemindersService.rescheduleReminders(rescheduleRemindersDto);
    }
    cancelScheduledReminderStatus(id) {
        return this.emailRemindersService.cancelScheduledReminderStatus(id);
    }
};
__decorate([
    (0, common_1.Get)('get-reminders-from-customer/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmailRemindersController.prototype, "getRemindersFromCustomer", null);
__decorate([
    (0, common_1.Post)('reschedule-reminders'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reschedule_reminders_dto_1.RescheduleRemindersDto]),
    __metadata("design:returntype", void 0)
], EmailRemindersController.prototype, "rescheduleReminders", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Patch)('cancel-reminder/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmailRemindersController.prototype, "cancelScheduledReminderStatus", null);
EmailRemindersController = __decorate([
    (0, common_1.Controller)({ path: 'onboard/email-reminders', version: '1' }),
    __metadata("design:paramtypes", [email_reminders_service_1.EmailRemindersService])
], EmailRemindersController);
exports.EmailRemindersController = EmailRemindersController;
//# sourceMappingURL=email-reminders.controller.js.map