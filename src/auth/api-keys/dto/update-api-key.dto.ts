import { IsOptional, IsString } from 'class-validator';

export class UpdateApiKeyDto {
  /**
   * Title for this API key
   *
   * @example 'Digital Marketing Platform'
   */
  @IsString()
  @IsOptional()
  title?: string;
}
