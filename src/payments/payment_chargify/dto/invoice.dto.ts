import { ValidateNested } from 'class-validator';

export class Product {
  title: string;
  quantity: number;
  unit_price: number;
}

class InvoiceInfo {
  line_items: Product[];
}

export class CreateInvoiceDto {
  @ValidateNested()
  invoice: InvoiceInfo;
}

class Void {
  reason: string;
}
export class VoidInvoiceDto {
  @ValidateNested()
  void: Void;
}
