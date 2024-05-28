import { BounceType, EventType } from 'aws-sdk/clients/ses';

interface SNSEvent {
  Type: 'Notification' | 'SubscriptionConfirmation';
  Message: string;
  Timestamp: string;
}

export interface SNSMessage {
  eventType: EventType;
  bounce?: {
    feedbackId: string;
    bounceType: BounceType;
    bounceSubType: 'General';
    bouncedRecipients: {
      emailAddress: string;
      action: string;
      status: string;
      diagnosticCode: string;
    }[];
    timestamp: string;
  };
  delivery?: {
    timestamp: string;
    processingTimeMillis: number;
    recipients: string[];
    smtpResponse: string;
    reportingMTA: string;
  };
  deliveryDelay?: {
    delayedRecipients: {
      status: string;
      diagnosticCode: string;
      emailAddress: string;
    }[];
  };
  complaint?: {
    complainedRecipients: string[];
    timestamp: string;
    feedbackId: string;
    // NOTE: If necessary we can get complaint subtype
    // to have a deeper understanding of the complaint
    complaintSubType: any;
  };
  mail: {
    timestamp: string;
    source: string;
    messageId: string;
    destination: string[];
  };
}

export default function parseSNSResponse(data: string) {
  try {
    const parsedJson: SNSEvent = JSON.parse(data);
    if (parsedJson?.Type !== 'SubscriptionConfirmation') {
      const parsedMsg: SNSMessage = JSON.parse(parsedJson.Message);
      return parsedMsg;
    }
    return parsedJson;
  } catch (err) {
    return null;
  }
}
