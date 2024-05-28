import { CreateDentistCoachDto } from '@/onboard/dentist-coaches/dto/create-dentist-coach.dto';
declare const UpdateDentistCoachDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDentistCoachDto>>;
export declare class UpdateDentistCoachDto extends UpdateDentistCoachDto_base {
    schedulingPoints?: number;
}
export {};
