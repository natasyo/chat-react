import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refreshTokenDto';

// @UseFilters(new PrismaClientExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.auth.login(dto);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: false, // в проде только https
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return data;
  }

  @Post('logout')
  async logout(@Body() dto: LogoutDto, @Req() req: Request) {
    console.log("req.cookies['refreshToken']", req.cookies['refreshToken']);
    return await this.auth.logout(dto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const oldToken = req.cookies.refreshToken;
    console.log('old token', oldToken);
    return await this.auth.refreshToken(dto);
  }
}
