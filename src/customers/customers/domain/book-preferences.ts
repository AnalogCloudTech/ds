import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class BookPreferences {
  @IsString()
  @Expose()
  phone: string;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  email: string;
}
