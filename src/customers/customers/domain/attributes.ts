import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class Attributes {
  @IsString()
  @Expose()
  firstName: string;

  @IsString()
  @Expose()
  lastName: string;

  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  phone: string;

  @IsString()
  @Expose()
  address: string;

  @IsString()
  @Expose()
  imageUrl: string;

  @IsString()
  @Expose()
  memberFirstName: string;

  @IsString()
  @Expose()
  memberLastName: string;

  @IsString()
  @Expose()
  memberTitle: string;

  @IsString()
  @Expose()
  memberBrokerName: string;

  @IsString()
  @Expose()
  memberAddress: string;

  @IsString()
  @Expose()
  memberPhone: string;

  @IsString()
  @Expose()
  memberProfileImage: string;

  @IsEmail()
  @Expose()
  memberEmail: string;

  @IsString()
  @Expose()
  memberBookUrl: string;
}
