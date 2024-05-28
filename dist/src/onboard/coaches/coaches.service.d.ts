import { FilterQuery, Model } from 'mongoose';
import { CreateCoachDto } from './dto/create-coach.dto';
import { Coach, CoachDocument } from './schemas/coach.schema';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { EmailRemindersService } from '@/onboard/email-reminders/email-reminders.service';
import { SchemaId } from '@/internal/types/helpers';
import { CoachId } from '@/onboard/coaches/domain/types';
export declare class CoachesService {
    private model;
    private readonly emailRemindersService;
    constructor(model: Model<CoachDocument>, emailRemindersService: EmailRemindersService);
    create(dto: CreateCoachDto): Promise<CoachDocument>;
    find(id: string): Promise<CoachDocument>;
    findByOwnerId(id: string): Promise<CoachDocument>;
    getNextCoachInRR(coachesToSkip?: Array<CoachId>): Promise<CoachDocument | null>;
    incrementScheduling(id: SchemaId): Promise<CoachDocument>;
    remove(id: string): Promise<CoachDocument>;
    update(id: string, dto: UpdateCoachDto): Promise<CoachDocument>;
    findAllPaginated(page: number, perPage: number): Promise<PaginatorSchematicsInterface<CoachDocument>>;
    findOne(id: string): Promise<CoachDocument>;
    findByEmail(email: string): Promise<CoachDocument>;
    count(filterQuery?: FilterQuery<CoachDocument>): Promise<number>;
    filter(filterQuery?: FilterQuery<CoachDocument>): Promise<(import("mongoose").Document<unknown, any, Coach> & Coach & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
