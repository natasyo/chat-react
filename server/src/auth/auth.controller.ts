import { Body, Controller, Post, Req, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { PrismaClientExceptionFilter } from '../common/filters/prisma-exception.filter';
import { LoginDto } from './dto/login.dto';

// @UseFilters(new PrismaClientExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.auth.login(dto);
  }
}
