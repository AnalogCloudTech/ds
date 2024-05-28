import { IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateDentistCoachDto } from '@/onboard/dentist-coaches/dto/create-dentist-coach.dto';

export class UpdateDentistCoachDto extends PartialType(CreateDentistCoachDto) {
  @IsNumber()
  @IsOptional()
  schedulingPoints?: number;
}
