import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class BookDetailsDto {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  phone: string;

  @IsString()
  @Expose()
  book: string;
}
