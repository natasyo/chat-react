import { IsEmail, IsString, MinLength } from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Min length 6' })
  password: string;

  @IsString()
  @Match('password', { message: 'пароли не совпадают' })
  confirmPassword: string;
}
