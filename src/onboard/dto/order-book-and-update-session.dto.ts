import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class OrderBookAndUpdateSessionDto {
  @IsString()
  draftId: string;

  @IsString()
  offerCode: string;

  @IsNumber()
  quantity: number;

  @IsBoolean()
  isDigital: boolean;

  @IsString()
  shippingAddressId: string;

  @IsString()
  sessionId: string;
}
