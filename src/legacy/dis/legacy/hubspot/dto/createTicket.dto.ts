import { IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  bookName: string;

  @IsString()
  content: string;
}

export class CreateTicketResponseDto {
  @IsString()
  ticketId: string;

  @IsString()
  contactId: string;
}
