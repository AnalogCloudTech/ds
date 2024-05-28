import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Length,
} from 'class-validator';

export class CurrentMagazineMonthDate {
  @IsString()
  @IsNotEmpty()
  @Length(3)
  month: string;

  @IsString()
  @IsNotEmpty()
  @Length(4)
  year: string;
}

export class TurnMonthDto {
  @IsNotEmptyObject()
  currentData: CurrentMagazineMonthDate;

  @IsNotEmptyObject()
  lastData: CurrentMagazineMonthDate;
}
