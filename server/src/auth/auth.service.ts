import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as process from 'node:process';
import { LogoutDto } from './dto/logout.dto';
import { randomUUID } from 'crypto';
import { RefreshTokenDto } from './dto/refreshTokenDto';

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
      createdAt: Date.now(),
    };

    const accessToken = await this.jwtService.signAsync(payloadAccess, {
      secret: process.env.SECRET_KEY,
      expiresIn: '24h',
    });
    const payloadRefresh = {
      sub: user.id,
      email: user.email,
      jti: randomUUID(),
      createdAt: Date.now(),
    };
    const refreshToken = randomUUID().toString();
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

      for (const token of tokens) {
        console.log(token);
        const isMatch = await bcrypt.compare(
          logoutDto.refreshToken,
          token.token,
        );
        console.log(isMatch);
        if (isMatch) {
          await this.prisma.refreshTokens.delete({
            where: { id: token.id },
          });
        }
      }
    } catch (error) {
      console.log('logout', error);
      throw new UnauthorizedException();
    }
  }
  async refreshToken(refreshDto: RefreshTokenDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: refreshDto.email },
      });
      if (!user) return null;
      const tokens = await this.prisma.refreshTokens.findMany({
        where: { userId: user.id },
      });
      for (const token of tokens) {
        const isMatch = await bcrypt.compare(
          refreshDto.refreshToken,
          token.token,
        );
        console.log(isMatch);
        if (isMatch) {
          const newAccessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            jti: randomUUID(),
            createdAt: Date.now(),
          });
          const newRefreshToken = randomUUID().toString();
          await this.prisma.refreshTokens.update({
            where: { id: token.id },
            data: { token: newRefreshToken },
          });
          return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            email: user.email,
          };
        }
      }
      return new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        console.log('asdkla;skdl;');
        throw new UnauthorizedException('Access token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
