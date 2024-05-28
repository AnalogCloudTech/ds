import { FilterQuery, Model } from 'mongoose';
import { CreateDentistCoachDto } from './dto/create-dentist-coach.dto';
import { DentistCoachDocument } from './schemas/dentist-coach.schema';
import { UpdateDentistCoachDto } from './dto/update-dentist-coach.dto';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { EmailRemindersService } from '@/onboard/email-reminders/email-reminders.service';
import { SchemaId } from '@/internal/types/helpers';
import { CoachId } from '@/onboard/coaches/domain/types';
export declare class DentistCoachesService {
    private model;
    private readonly emailRemindersService;
    constructor(model: Model<DentistCoachDocument>, emailRemindersService: EmailRemindersService);
    create(dto: CreateDentistCoachDto): Promise<DentistCoachDocument>;
    find(id: string): Promise<DentistCoachDocument>;
    findByOwnerId(id: string): Promise<DentistCoachDocument>;
    getNextCoachInRR(coachesToSkip?: Array<CoachId>): Promise<DentistCoachDocument | null>;
    incrementScheduling(id: SchemaId): Promise<DentistCoachDocument>;
    remove(id: string): Promise<DentistCoachDocument>;
    update(id: string, dto: UpdateDentistCoachDto): Promise<DentistCoachDocument>;
    findAllPaginated(page: number, perPage: number): Promise<PaginatorSchematicsInterface<DentistCoachDocument>>;
    findOne(id: string): Promise<DentistCoachDocument>;
    findByEmail(email: string): Promise<DentistCoachDocument>;
    count(filterQuery?: FilterQuery<DentistCoachDocument>): Promise<number>;
}
