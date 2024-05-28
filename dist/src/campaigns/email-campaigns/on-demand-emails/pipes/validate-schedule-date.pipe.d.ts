import { PipeTransform } from '@nestjs/common';
import { CreateOnDemandEmailDto } from '../dto/create-on-demand-email.dto';
export declare class ValidateScheduleDateTransformPipe implements PipeTransform {
    validateScheduleDate(dto: CreateOnDemandEmailDto): void;
    transformScheduleDate(dto: CreateOnDemandEmailDto): CreateOnDemandEmailDto;
    transform(dto: CreateOnDemandEmailDto): CreateOnDemandEmailDto;
}
