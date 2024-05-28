import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Book {
  /**
   * Book Id
   *
   * @example '5c5946cc2600de312de4e6b0'
   */
  @IsMongoId()
  @IsNotEmpty()
  bookId: string;
  /**
   * Selected template Id
   *
   * @example '5f08c6463ed175176bd25fc4'
   */
  @IsMongoId()
  @IsNotEmpty()
  templateId: string;

  /**
   * Book author's name
   *
   * @example 'John Doe'
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Book author's email
   *
   * @example 'john@smartagents.com'
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Book author's phone number
   *
   * @example '1234567890'
   */
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class GenerateBookDto {
  /**
   * Customer's registered Hubspot contact email
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Book Details
   *
   */
  @ValidateNested()
  @Type(() => Book)
  book: Book;

  @IsOptional()
  @IsString()
  avatarHeadshot?: string;
}

export class UpdateProfileAvatarDto {
  @IsNotEmpty()
  avatar: string;
}
