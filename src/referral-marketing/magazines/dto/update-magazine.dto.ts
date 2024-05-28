import { IsEnum, IsOptional } from 'class-validator';
import {
  Replacer,
  Selection,
} from '@/referral-marketing/magazines/domain/types';
import { MagazineStatus } from '@/referral-marketing/magazines/schemas/magazine.schema';

export class UpdateMagazineDto {
  @IsOptional()
  selection?: Selection;

  @IsOptional()
  baseReplacers?: Replacer[];

  @IsOptional()
  @IsEnum(MagazineStatus)
  status?: string;
}
