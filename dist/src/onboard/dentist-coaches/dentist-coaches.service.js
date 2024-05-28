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
exports.DentistCoachesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dentist_coach_schema_1 = require("./schemas/dentist-coach.schema");
const paginator_1 = require("../../internal/utils/paginator");
const email_reminders_service_1 = require("../email-reminders/email-reminders.service");
let DentistCoachesService = class DentistCoachesService {
    constructor(model, emailRemindersService) {
        this.model = model;
        this.emailRemindersService = emailRemindersService;
    }
    async create(dto) {
        const result = await new this.model(dto).save();
        return result;
    }
    async find(id) {
        const result = await this.model.findById(id);
        return result;
    }
    async findByOwnerId(id) {
        const filter = {
            hubspotId: id,
            enabled: true,
        };
        return this.model.findOne(filter);
    }
    async getNextCoachInRR(coachesToSkip = []) {
        const filter = {
            _id: { $nin: coachesToSkip },
            enabled: true,
        };
        const options = {
            sort: { schedulingPoints: 'asc' },
        };
        return this.model.findOne(filter, {}, options);
    }
    async incrementScheduling(id) {
        return this.model.findOneAndUpdate({ _id: id }, { $inc: { schedulingPoints: 1 } });
    }
    async remove(id) {
        try {
            await this.emailRemindersService.removeAllRemindersFromCoach(id);
            return this.model.findByIdAndRemove(id).exec();
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_1.HttpException(Object.assign(Object.assign({}, err), { message: 'Error while remove dentist coach | reminders' }), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async update(id, dto) {
        const result = await this.model.findByIdAndUpdate(id, dto, { new: true });
        if (!result) {
            throw new common_1.HttpException({ message: 'dentist coach not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async findAllPaginated(page, perPage) {
        const total = await this.model.find().countDocuments().exec();
        const skip = page * perPage;
        const coaches = await this.model
            .find()
            .skip(skip)
            .limit(perPage)
            .sort({ createdAt: 'desc' })
            .exec();
        return paginator_1.PaginatorSchema.build(total, coaches, page, perPage);
    }
    async findOne(id) {
        return this.model.findById(id);
    }
    async findByEmail(email) {
        return this.model.findOne({ email });
    }
    async count(filterQuery) {
        return this.model.countDocuments(filterQuery).exec();
    }
};
DentistCoachesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dentist_coach_schema_1.DentistCoach.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_reminders_service_1.EmailRemindersService])
], DentistCoachesService);
exports.DentistCoachesService = DentistCoachesService;
//# sourceMappingURL=dentist-coaches.service.js.map