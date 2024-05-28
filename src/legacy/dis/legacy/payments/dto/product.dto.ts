import { IsNumber, IsString } from 'class-validator';

export class SubscriptionProduct {
  @IsString()
  id: string;
}

export class OneTimeProduct {
  @IsString()
  id: string;

  @IsNumber()
  quantity: number;
}
