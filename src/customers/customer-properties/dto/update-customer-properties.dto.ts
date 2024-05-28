import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCustomerPropertiesDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
