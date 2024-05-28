import { IsString } from 'class-validator';

export class CreateApiKeyDto {
  /**
   * Title for this API key
   *
   * @example 'Digital Marketing Platform'
   */
  @IsString()
  title: string;
}
