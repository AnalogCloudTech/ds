import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { CoachImageUrl } from './types';

export class Coach {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  image: CoachImageUrl;
}
