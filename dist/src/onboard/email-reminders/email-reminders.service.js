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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailRemindersService = void 0;
const common_1 = require("@nestjs/common");
const email_reminders_repository_1 = require("./repositories/email-reminders.repository");
const luxon_1 = require("luxon");
const types_1 = require("./domain/types");
const customers_service_1 = require("../../customers/customers/customers.service");
const lodash_1 = require("lodash");
let EmailRemindersService = class EmailRemindersService {
    constructor(repository, customersService) {
        this.repository = repository;
        this.customersService = customersService;
    }
    create(createEmailReminderDto) {
        return this.repository.create(createEmailReminderDto);
    }
    findAll(filters) {
        return this.repository.findAll(filters);
    }
    update(id, updateEmailReminderDto) {
        return this.repository.update(id, updateEmailReminderDto);
    }
    async sendAllRemindersEmail(customer, coach, session, date, timezone, isRescheduling = false) {
        const promises = [
            this.repository.sendEmailReminder(customer, coach, session, date, timezone, types_1.ReminderDelays.FIFTEEN_MINUTES),
            this.repository.sendEmailReminder(customer, coach, session, date, timezone, types_1.ReminderDelays.ONE_HOUR),
            this.repository.sendEmailReminder(customer, coach, session, date, timezone, types_1.ReminderDelays.FOUR_HOURS),
        ];
        if (!isRescheduling) {
            promises.push(this.repository.sendEmailReminder(customer, coach, session, date, timezone, types_1.ReminderDelays.CONFIRMATION));
        }
        return Promise.all(promises);
    }
    async getRemindersFromCustomer(email) {
        const customer = await this.customersService.findByEmail(email);
        if (!customer) {
            throw new common_1.NotFoundException({
                message: 'Customer not found',
                method: 'EmailRemindersService@getRemindersFromCustomer',
            });
        }
        return this.repository.getFromCustomer(customer);
    }
    async rescheduleReminders(rescheduleRemindersDto) {
        var _a;
        const { customerEmail, newMeetingDate, timezone } = rescheduleRemindersDto;
        const customer = await this.customersService.findByEmail(customerEmail);
        await this.repository.setRemindersRescheduledFromCustomer(customer);
        const oldReminders = await this.findAll({
            customer: { $eq: customer._id },
        });
        const { coach, session, timezone: origTimezone, } = (0, lodash_1.first)(oldReminders);
        const meetingTimezone = (_a = timezone !== null && timezone !== void 0 ? timezone : origTimezone) !== null && _a !== void 0 ? _a : 'EST';
        const meetingDate = luxon_1.DateTime.fromISO(newMeetingDate, {
            zone: meetingTimezone,
        });
        const isRescheduling = true;
        return this.sendAllRemindersEmail(customer, coach, session, meetingDate, meetingTimezone, isRescheduling);
    }
    async removeAllRemindersFromCoach(coachId) {
        const query = {
            coach: { $eq: coachId },
        };
        return this.repository.removeFromQuery(query);
    }
    async cancelScheduledReminderStatus(id) {
        const query = {
            _id: { $eq: id },
        };
        const prop = await this.repository.findOne(query);
        if (!prop) {
            throw new common_1.NotFoundException('Reminder not found');
        }
        return this.repository.cancelScheduledReminderStatus(id);
    }
    async deleteAllFromFilter(filter) {
        return this.repository.deleteAllFromFilter(filter);
    }
};
EmailRemindersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_reminders_repository_1.EmailRemindersRepository,
        customers_service_1.CustomersService])
], EmailRemindersService);
exports.EmailRemindersService = EmailRemindersService;
//# sourceMappingURL=email-reminders.service.js.map