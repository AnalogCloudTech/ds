import { IsOptional, IsString } from 'class-validator';

export class CreateRmPrintTicketDto {
  @IsString()
  email: string;

  @IsString()
  coverUrl: string;

  @IsString()
  magazineMonth: string;

  @IsString()
  additionalInformation: string;

  @IsString()
  rmProofLink: string;

  @IsString()
  rmShippedMagazineLink: string;

  @IsString()
  rmMemberSiteLink: string;

  @IsString()
  @IsOptional()
  adminFullName?: string;
}

export class CreateRmPrintTicketResponseDto {
  @IsString()
  ticketId: string;

  @IsString()
  contactId: string;
}
