import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
