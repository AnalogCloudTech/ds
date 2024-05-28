import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateGeneratedMagazineDto {
  @IsString()
  month: string;

  @IsString()
  @Length(4, 4)
  year: string;

  @IsOptional()
  @IsBoolean()
  createdByAutomation?: boolean;
}
