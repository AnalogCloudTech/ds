/// <reference types="mongoose" />
import { CreateDentistCoachDto } from './dto/create-dentist-coach.dto';
import { UpdateDentistCoachDto } from './dto/update-dentist-coach.dto';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { DentistCoachesService } from '@/onboard/dentist-coaches/dentist-coaches.service';
import { DentistCoachDocument } from '@/onboard/dentist-coaches/schemas/dentist-coach.schema';
export declare class DentistCoachesController {
    private readonly service;
    constructor(service: DentistCoachesService);
    findAll({ page, perPage }: Paginator): Promise<PaginatorSchematicsInterface<DentistCoachDocument>>;
    findOne(id: string): Promise<DentistCoachDocument>;
    register(body: CreateDentistCoachDto): Promise<import("mongoose").Document<unknown, any, import("@/onboard/dentist-coaches/schemas/dentist-coach.schema").DentistCoach> & import("@/onboard/dentist-coaches/schemas/dentist-coach.schema").DentistCoach & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, any, import("@/onboard/dentist-coaches/schemas/dentist-coach.schema").DentistCoach> & import("@/onboard/dentist-coaches/schemas/dentist-coach.schema").DentistCoach & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, body: UpdateDentistCoachDto): Promise<import("mongoose").Document<unknown, any, import("@/onboard/dentist-coaches/schemas/dentist-coach.schema").DentistCoach> & import("@/onboard/dentist-coaches/schemas/dentist-coach.schema").DentistCoach & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
