import { IsNotEmpty, IsString } from 'class-validator';

export class FindCustomerByNameOrEmailDto {
  @IsNotEmpty()
  @IsString()
  nameOrEmail: string;
}
