export class EmailsMetricsDto {
  data: Array<{
    date: string;
    events: Array<{
      type: string;
      ref: string;
      createdAt: string;
      to: string;
      from: string;
    }>;
    meta: {
      [key: string]: number;
    };
  }>;
  meta: {
    Send: number;
    Open: number;
    Click: number;
    Bounce: number;
    Complaint: number;
    Reject: number;
    Delivery: number;
  };
}
