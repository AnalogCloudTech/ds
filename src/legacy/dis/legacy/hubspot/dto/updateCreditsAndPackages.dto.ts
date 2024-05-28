import { IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateCreditsAndPackagesDto {
  @IsString()
  id: string;

  @IsArray()
  packages: string[];

  @IsNumber()
  credits: number;
}
