import { BadRequestException, PipeTransform } from '@nestjs/common';
import { CreateOnDemandEmailDto } from '../dto/create-on-demand-email.dto';
import { DateTime } from 'luxon';

export class ValidateScheduleDateTransformPipe implements PipeTransform {
  validateScheduleDate(dto: CreateOnDemandEmailDto): void {
    if (!dto.scheduleDate) {
      throw new BadRequestException([
        'Schedule date is required when Send Immediately is false',
      ]);
    }

    const scheduleDate = DateTime.fromISO(dto.scheduleDate).setZone(
      dto.timezone,
    );
    if (!scheduleDate.isValid) {
      throw new BadRequestException(scheduleDate.invalidExplanation);
    }

    if (DateTime.now() > scheduleDate) {
      throw new BadRequestException(['Schedule date must be greater than now']);
    }
  }

  transformScheduleDate(dto: CreateOnDemandEmailDto): CreateOnDemandEmailDto {
    const scheduleDate = DateTime.now().setZone(dto.timezone).startOf('second');

    if (!scheduleDate.isValid) {
      throw new BadRequestException(scheduleDate.invalidExplanation);
    }

    dto.scheduleDate = scheduleDate.toISO({
      includeOffset: false,
      suppressMilliseconds: true,
    });

    return dto;
  }

  transform(dto: CreateOnDemandEmailDto): CreateOnDemandEmailDto {
    if (!dto.sendImmediately) {
      this.validateScheduleDate(dto);
    }

    if (dto.sendImmediately) {
      dto = this.transformScheduleDate(dto);
    }

    return dto;
  }
}
