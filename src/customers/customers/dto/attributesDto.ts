import { IsEmail, IsString } from 'class-validator';

export class CreateAttributesDto {
  @IsEmail()
  email: string;

  @IsString()
  brokerAddress: string;

  @IsString()
  imageUrl: string;

  @IsString()
  memberFirstName: string;

  @IsString()
  memberLastName: string;

  @IsString()
  memberTitle: string;

  @IsString()
  memberBrokerName: string;

  @IsString()
  memberAddress: string;

  @IsString()
  memberPhone: string;

  @IsString()
  memberProfileImage: string;

  @IsEmail()
  memberEmail: string;

  @IsString()
  memberBookUrl: string;
}
