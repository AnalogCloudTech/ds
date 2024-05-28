import { ValidateNested } from 'class-validator';

class Payment {
  amount: number;
  memo: string;
  payment_method_name: string;
  payment_method_details: string;
}

export class createPaymentDto {
  @ValidateNested()
  payment: Payment;
}
