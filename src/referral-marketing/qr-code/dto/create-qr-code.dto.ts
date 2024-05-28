import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQrCodeDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
