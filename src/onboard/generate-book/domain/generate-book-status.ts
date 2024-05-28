import { Expose, Type } from 'class-transformer';
import { IsUrl, IsEnum, ValidateNested, IsString } from 'class-validator';
import { Status as StatusEnum } from './types';

class Pages {
  @Expose()
  @IsUrl()
  read: string;

  @Expose()
  @IsUrl()
  landing: string;
}
class Links {
  @IsUrl()
  @Expose()
  book: string;

  @ValidateNested()
  @Expose()
  @Type(() => Pages)
  pages: Pages;
}

class Status {
  @IsEnum(StatusEnum)
  @Expose()
  book: StatusEnum;

  @IsEnum(StatusEnum)
  @Expose()
  pages: StatusEnum;
}

export class GenerateBookStatus {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  title: string;

  @IsString()
  @Expose()
  bookId: string;

  @ValidateNested()
  @Type(() => Links)
  @Expose()
  links: Links;

  @ValidateNested()
  @Type(() => Status)
  @Expose()
  status: Status;
}
