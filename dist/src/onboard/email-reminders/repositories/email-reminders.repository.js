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
exports.EmailRemindersRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const email_reminder_schema_1 = require("../schemas/email-reminder.schema");
const mongoose_2 = require("mongoose");
const luxon_1 = require("luxon");
const types_1 = require("../domain/types");
const lodash_1 = require("lodash");
let EmailRemindersRepository = class EmailRemindersRepository {
    constructor(emailReminderModel) {
        this.emailReminderModel = emailReminderModel;
    }
    create(dto) {
        return this.emailReminderModel.create(dto);
    }
    async findAll(filters) {
        return this.emailReminderModel
            .find(filters)
            .populate(['customer', 'coach', 'session'])
            .exec();
    }
    async update(id, updateEmailReminderDto) {
        return this.emailReminderModel.findByIdAndUpdate(id, updateEmailReminderDto, {
            new: true,
        });
    }
    async getFromCustomer(customer) {
        const filter = {
            customer: { $eq: customer._id },
        };
        return this.emailReminderModel.find(filter).exec();
    }
    async sendEmailReminder(customer, coach, session, date, timezone, delay) {
        const subject = this.getEmailSubject(delay, customer);
        const meetingDate = date.toJSDate();
        const condition = (0, lodash_1.get)(coach, 'meetingLink', false) && (0, lodash_1.get)(customer, 'firstName', false);
        if (!condition) {
            throw new common_1.HttpException({
                message: `Unable to create reminders for customer: ${customer._id}`,
                session: session._id,
                customer: customer._id,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const jsDate = delay === types_1.ReminderDelays.CONFIRMATION
            ?
                luxon_1.DateTime.now().toJSDate()
            :
                date.minus({ minutes: delay }).toJSDate();
        const dto = {
            customer: customer._id,
            coach: coach._id,
            session: session._id,
            meetingLink: coach.meetingLink,
            subject,
            date: jsDate,
            meetingDate,
            timezone: timezone,
        };
        return this.create(dto);
    }
    async setRescheduled(reminders) {
        const filters = {
            _id: {
                $in: reminders.map((emailReminder) => emailReminder._id),
            },
            status: types_1.Status.SCHEDULED,
        };
        const update = {
            status: types_1.Status.RESCHEDULED,
        };
        await this.emailReminderModel
            .updateMany(filters, update, {
            new: true,
        })
            .exec();
    }
    async setRemindersRescheduledFromCustomer(customer) {
        const filter = {
            customer: customer._id,
        };
        const reminders = await this.findAll(filter);
        await this.setRescheduled(reminders);
    }
    async removeFromQuery(query) {
        return this.emailReminderModel.deleteMany(query).exec();
    }
    getEmailSubject(delay, { firstName }) {
        const { IMMEDIATE, FIFTEEN_MINUTES, ONE_HOUR, FOUR_HOURS, CONFIRMATION } = types_1.ReminderDelays;
        switch (delay) {
            case CONFIRMATION:
                return '[Meeting Confirmation] Authorify Introductory Call';
            case IMMEDIATE:
                return `${firstName}, the Meeting is Starting Now!`;
            case FIFTEEN_MINUTES:
                return `${firstName}, the Meeting is Starting Now!`;
            case ONE_HOUR:
                return `It's almost time! Today's meeting starts in just 1 hour`;
            case FOUR_HOURS:
                return `${firstName}, ready to get Listings with your Authorify membership?`;
            default:
                return '';
        }
    }
    async cancelScheduledReminderStatus(id) {
        return this.emailReminderModel.findByIdAndUpdate(id, { status: types_1.Status.CANCELED }, {
            new: true,
        });
    }
    async findOne(query) {
        return this.emailReminderModel.findOne(query).exec();
    }
    async deleteAllFromFilter(filter) {
        const deleteResults = await this.emailReminderModel.deleteMany(filter);
        return deleteResults.deletedCount;
    }
};
EmailRemindersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(email_reminder_schema_1.EmailReminder.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EmailRemindersRepository);
exports.EmailRemindersRepository = EmailRemindersRepository;
//# sourceMappingURL=email-reminders.repository.js.map