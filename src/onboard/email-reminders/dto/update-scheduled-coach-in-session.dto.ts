import { SchemaId } from '@/internal/types/helpers';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateScheduledCoachInSessionDto {
  @IsString()
  @IsNotEmpty()
  sessionId: SchemaId;

  @IsString()
  @IsNotEmpty()
  coachEmail: string;
}
