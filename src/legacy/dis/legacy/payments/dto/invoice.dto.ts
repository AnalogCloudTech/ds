import { Stripe as StripeLib } from 'stripe';

export class InvoiceResponse {
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  billingReason: string;
  created: number;
  email: string;
  status: string;
  paidDate: number;
  total: number;
}

export type ListInvoiceParams = StripeLib.InvoiceListParams;
export type Invoice = StripeLib.Invoice;
export type InvoiceStatus = StripeLib.Invoice.Status;
