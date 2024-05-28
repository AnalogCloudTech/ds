import { IsString, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookDto {
  @IsMongoId()
  bookId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  landingPageUrl?: string;

  @IsString()
  digitalBookUrl?: string;

  @IsString()
  customLandingPageUrl?: string;
}
