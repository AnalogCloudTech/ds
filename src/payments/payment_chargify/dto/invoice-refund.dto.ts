export class InvoiceRefundDTO {
  invoice_uid: string;
  amount: string;
  memo: string;
  // transaction_id
  payment_id: number;
}
