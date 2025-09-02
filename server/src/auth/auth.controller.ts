import { Body, Controller, Post, Req, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { PrismaClientExceptionFilter } from '../common/filters/prisma-exception.filter';

// @UseFilters(new PrismaClientExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register')
  register(@Body() dto: { email: string; password: string }) {
    return this.auth.register(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: RegisterDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
