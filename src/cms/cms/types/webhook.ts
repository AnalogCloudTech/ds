import { SES } from 'aws-sdk';

export enum Models {
  SEGMENT = 'segment',
  EMAIL_TEMPLATE = 'email-template',
}

export enum EventType {
  ENTRY_CREATE = 'entry.create',
  ENTRY_UPDATE = 'entry.update',
  ENTRY_DELETE = 'entry.delete',
  ENTRY_PUBLISH = 'entry.publish',
  ENTRY_UNPUBLISH = 'entry.unpublish',
  MEDIA_CREATE = 'media.create',
  MEDIA_UPDATE = 'media.update',
  MEDIA_DELETE = 'media.delete',
}

export type Event<T = any> = {
  event: EventType;
  createdAt: Date;
  model: string;
  entry: T;
};

export type SESTemplateResponse =
  | SES.UpdateTemplateResponse
  | SES.CreateTemplateResponse
  | SES.DeleteTemplateResponse
  | null;
