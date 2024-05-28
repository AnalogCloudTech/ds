import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuotationDto {
  @IsString()
  @IsNotEmpty()
  dealId: string;
}
