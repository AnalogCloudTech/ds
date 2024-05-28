import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateMagazineAdminDto {
  @IsString()
  @IsNotEmpty()
  @Length(3)
  month: string;

  @IsString()
  @IsNotEmpty()
  @Length(4)
  year: string;

  @IsString()
  @IsNotEmpty()
  customer: string;
}
