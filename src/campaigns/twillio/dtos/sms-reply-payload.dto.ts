import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SmsReplyPayloadDto {
  @IsString()
  ToCountry: string;

  ToState: string;

  //SM...
  @IsString()
  SmsMessageSid: string;

  @Type(() => Number)
  NumMedia: number;

  @IsString()
  ToCity: string;

  @IsString()
  FromZip: string;

  @IsString()
  //SM...
  SmsSid: string;

  @IsString()
  FromState: string;

  @IsString()
  SmsStatus: string;

  @IsString()
  FromCity: string;

  @IsString()
  Body: string;

  @IsString()
  FromCountry: string;

  @IsString()
  // +1.... phone number
  To: string;

  @IsString()
  //MG...
  MessagingServiceSid: string;

  @IsString()
  ToZip: string;

  @Type(() => Number)
  NumSegments: number;

  @IsString()
  //SM...
  MessageSid: string;

  @IsString()
  //AC...
  AccountSid: string;

  @IsString()
  // +1... phone number
  From: string;

  @Type(() => Date)
  ApiVersion: Date;
}
