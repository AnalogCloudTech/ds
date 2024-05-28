import { IsEnum } from 'class-validator';
import { MagazineStatus } from '@/referral-marketing/magazines/schemas/magazine.schema';

export class UpdateMagazineStatusDto {
  @IsEnum(MagazineStatus)
  status: string;
}
