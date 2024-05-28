import { Expose } from 'class-transformer';
import { IsDateString } from 'class-validator';

export class CoachingSlot {
  @IsDateString()
  @Expose()
  start: Date;

  @IsDateString()
  @Expose()
  end: Date;
}
