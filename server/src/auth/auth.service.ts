import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as process from 'node:process';
import { LogoutDto } from './dto/logout.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    return this.prisma.user.create({
      data: { email: registerDto.email, password: hashedPassword },
    });
  }
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user || !user.password) throw new UnauthorizedException();
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException();
    const payloadAccess = {
      sub: user.id,
      email: user.email,
      jti: randomUUID(),
    };

    const accessToken = await this.jwtService.signAsync(payloadAccess, {
      secret: process.env.SECRET_KEY,
      expiresIn: '15m',
    });
    const payloadRefresh = {
      sub: user.id,
      email: user.email,
      jti: randomUUID(),
    };
    const refreshToken = await this.jwtService.signAsync(payloadRefresh, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1h',
    });
    const hashToken = await bcrypt.hash(refreshToken, 12);
    const result = await this.prisma.refreshTokens.create({
      data: {
        userId: user.id,
        token: hashToken,
      },
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      email: user.email,
    };
  }

  async logout(logoutDto: LogoutDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: logoutDto.email },
      });
      if (!user) return null;
      const tokens = await this.prisma.refreshTokens.findMany({
        where: { userId: user.id },
      });
      if (!tokens) return null;
      tokens.map(async (token) => {
        if (await bcrypt.compare(logoutDto.refreshToken, token.token)) {
          console.log('Ok-------------', logoutDto.refreshToken, token);
          return this.prisma.refreshTokens.delete({
            where: { id: token.id },
          });
        }
      });
    } catch (error) {
      console.log('logout', error);
      throw new UnauthorizedException();
    }
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch (err) {
      console.log('sdfsdfsdf', err);
      throw new UnauthorizedException();
    }
  }
}
