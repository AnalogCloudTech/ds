import { ExistsInCms } from '@/cms/cms/validation-rules/exists-in-cms';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Replacer } from '@/referral-marketing/magazines/domain/types';
import { Customer } from '@/customers/customers/domain/customer';

export class CreateMagazineDto {
  /**
   * magazineId from STRAPI
   *
   * @Example 'ObjectId'
   * */
  @IsNumber()
  @ExistsInCms(['magazineDetails'])
  magazineId: number;

  /**
   * replacers that should be replaced on every page of the magazine
   */
  @IsOptional()
  baseReplacers?: Replacer[];

  @IsOptional()
  @IsBoolean()
  createdByAutomation?: boolean;
}

export type MonthAbbreviation =
  | 'JAN'
  | 'FEB'
  | 'MAR'
  | 'APR'
  | 'MAY'
  | 'JUN'
  | 'JUL'
  | 'AUG'
  | 'SEP'
  | 'OCT'
  | 'NOV'
  | 'DEC';

export type MagazineDocumentDto = {
  customer: Customer;
  magazineId: string;
  year: number;
  month: string;
};
