import { IsEmail } from 'class-validator';

export class HubspotCreateDealRequestDto {
  @IsEmail()
  email: string;
}
