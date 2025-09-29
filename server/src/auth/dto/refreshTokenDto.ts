import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  refreshToken: string;
}
