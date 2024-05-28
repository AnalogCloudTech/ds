import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  /**
   * User's given name
   *
   * @example 'John Doe'
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * User's email, this is used for login, therefore, it has to be unique
   *
   * @example 'john@example.com'
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
