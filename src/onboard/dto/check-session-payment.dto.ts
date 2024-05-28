import { IsString } from 'class-validator';

export class CheckSessionPaymentDto {
  @IsString()
  offerId: string;

  @IsString()
  sessionId: string;
}
