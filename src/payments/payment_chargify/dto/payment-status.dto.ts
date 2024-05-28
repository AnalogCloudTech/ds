import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PaymentStatusDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  isApproved: boolean;
}
