import { SchemaId } from '@/internal/types/helpers';

export type HubspotId = string;

export type CoachImageUrl = string;

export type CoachId = SchemaId;

export type CalendarId = string;

export enum Type {
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription',
}
