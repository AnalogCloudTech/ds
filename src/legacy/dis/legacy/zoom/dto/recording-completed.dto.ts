import { SchemaId } from '@/internal/types/helpers';
import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';

export class RecordingCompletedPayloadObjectDto {
  id: string;
  user_id: string;
  caller_number: string;
  caller_number_type: number;
  caller_name: string;
  callee_number: string;
  callee_number_type: number;
  callee_name: string;
  duration: number;
  download_url: string;
  direction: string;
  date_time: string;
  recording_type: string;
  call_id: string;
  call_log_id: string;
  end_time: string;
  site: {
    id: string;
  };
  owner: {
    type: string;
    id: string;
    name: string;
  };
}
export class RecordingCompletedPayloadDto {
  @IsString()
  account_id: string;

  object: {
    recordings: RecordingCompletedPayloadObjectDto[];
  };
  plainToken?: string;
}

export class RecordingCompletedDto {
  /**
   * Event type
   *
   * @example phone.recording_completed
   */
  @IsString()
  event: string;

  /**
   * Event time stamp
   *
   * @example 1626230691572
   */
  event_ts: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => RecordingCompletedPayloadDto)
  payload: RecordingCompletedPayloadDto;
}

export enum FileExt {
  MP4,
  M4A,
  TXT,
  VTT,
  CSV,
  JSON,
  JPG,
}

export enum FileType {
  MP4,
  M4A,
  CHAT,
  TRANSCRIPT,
  CSV,
  TB,
  CC,
  CHAT_MESSAGE,
  SUMMARY,
  TIMELINE,
}

export class ZoomRecordingFile {
  id: string;
  meeting_id: string;
  recording_start: string;
  recording_end: string;
  file_type: FileType;
  file_size: number;
  file_extension: FileExt;
  file_name: string;
  play_url: string;
  download_url: string;
  file_path: string;
  status: 'completed' | 'processing';
  recording_type: string;
}

export class ZoomRecordingObject {
  id: string;
  uuid: string;
  account_id: string;
  host_id: string;
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  host_email: string;
  total_size: number;
  recording_count: number;
  share_url: string;
  recording_files: ZoomRecordingFile[];
  password: string;
  recording_play_passcode: string;
  on_prem: boolean;
  file_location: string;
  bucketName: string;
  keyName: string;
}

export interface ZoomUserTypes {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  type: number;
  role_name: string;
  pmi: number;
  use_pmi: boolean;
  personal_meeting_url: string;
  timezone: string;
  verified: number;
  dept: string;
  created_at: Date;
  last_login_time: Date;
  last_client_version: string;
  pic_url: string;
  cms_user_id: string;
  jid: string;
  group_ids: any[];
  im_group_ids: any[];
  account_id: string;
  language: string;
  phone_number: string;
  status: string;
  job_title: string;
  company: string;
  location: string;
  login_types: number[];
  role_id: string;
  account_number: number;
  cluster: string;
  user_created_at: Date;
}

export interface ZoomAuthTypes {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

export interface ZoomCoachType {
  coachEmailList: string[];
  message: string;
}

export interface ZoomMeetingFilter {
  topic: string;
  startDate: string;
  endDate: string;
}

export interface ZoomCallFilter {
  startDate: string;
  endDate: string;
}

export interface ZoomEmailType {
  email: string;
}

export interface ZoomMemberDetails {
  id?: SchemaId;
  hostEmail: string;
  fullName: string;
  zoomAwsUpload: boolean;
  zoomAwsDelete: boolean;
  zoomAppInstantDelete: boolean;
  zoomAppLaterDelete: boolean;
  zoomIQSalesAccount: boolean;
}

export interface ZoomPhoneUserDetails {
  id?: SchemaId;
  email: string;
}
