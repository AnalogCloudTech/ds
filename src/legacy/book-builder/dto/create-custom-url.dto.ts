import { IsString, IsArray } from 'class-validator';

export class CreateCustomUrlDto {
  @IsString()
  customerId: string;
  @IsString()
  email: string;
  @IsArray()
  books: Array<any>;
}
