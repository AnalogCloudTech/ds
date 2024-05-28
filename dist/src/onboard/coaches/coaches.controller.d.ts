/// <reference types="mongoose" />
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { CoachesService } from '@/onboard/coaches/coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
export declare class CoachesController {
    private readonly service;
    constructor(service: CoachesService);
    findAll({ page, perPage }: Paginator): Promise<PaginatorSchematicsInterface<CoachDocument>>;
    findOne(id: string): Promise<CoachDocument>;
    register(body: CreateCoachDto): Promise<import("mongoose").Document<unknown, any, import("@/onboard/coaches/schemas/coach.schema").Coach> & import("@/onboard/coaches/schemas/coach.schema").Coach & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string): void;
    update(id: string, body: UpdateCoachDto): Promise<import("mongoose").Document<unknown, any, import("@/onboard/coaches/schemas/coach.schema").Coach> & import("@/onboard/coaches/schemas/coach.schema").Coach & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
