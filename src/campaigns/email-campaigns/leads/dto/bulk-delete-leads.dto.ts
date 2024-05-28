import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class BulkDeleteLeadsDto {
  @IsArray()
  @IsOptional()
  ids?: Array<string>;

  @IsOptional()
  @IsBoolean()
  deleteAll?: boolean;
}
