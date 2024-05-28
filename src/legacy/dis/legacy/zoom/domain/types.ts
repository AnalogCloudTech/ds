import { SchemaId } from '@/internal/types/helpers';

export type ZoomId = SchemaId;

export interface ZoomAwsSignedUrl {
  preSignedUrl: string;
  message: string;
}

export interface CoachesWithMeetingCount {
  fullName: string;
  hostEmail: string;
  meetingCount: number;
  phoneCalls: number;
  avatar?: string;
}
