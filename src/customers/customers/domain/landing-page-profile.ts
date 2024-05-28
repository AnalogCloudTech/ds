import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Url } from './types';

export class LandingPageProfile {
  @IsString()
  @Expose()
  firstName: string;

  @IsString()
  @Expose()
  lastName: string;

  @IsString()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  phone: string;

  @IsString()
  @Expose()
  brokerAddress: string;

  @IsString()
  @Expose()
  brokerLogo: Url;
}
