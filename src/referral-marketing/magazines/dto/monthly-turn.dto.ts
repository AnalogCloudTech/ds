import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';

export class MonthlyTurnDto {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  currentData: {
    month: string;
    year: string;
  };

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  lastData: {
    month: string;
    year: string;
  };
}
