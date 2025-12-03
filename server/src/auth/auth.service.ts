import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as process from 'node:process';
import { randomUUID } from 'crypto';
import { EXPIRES_ACCESS_TOKEN, EXPIRES_REFRESH_TOKEN } from '../../config';
import { Response, Request } from 'express';
import { User, RefreshTokens } from '@prisma/client';
export type AuthPayload = {
  sub: string;
  email: string;
  jti: string;
  createdAt: number;
};
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

  setTokens = async (payloadAccess: AuthPayload, user: User, res: Response) => {
    const accessToken = await this.jwtService.signAsync(payloadAccess, {
      secret: process.env.SECRET_KEY,
      expiresIn: EXPIRES_ACCESS_TOKEN,
    });
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: EXPIRES_ACCESS_TOKEN * 1000,
    });
    const refreshToken = randomUUID().toString();
    await this.prisma.refreshTokens.create({
      data: {
        userId: user.id,
        token: refreshToken,
      },
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: EXPIRES_REFRESH_TOKEN * 1000,
    });
  };

  async login(loginDto: LoginDto, res: Response) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user || !user.password) throw new UnauthorizedException();
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException();
    const payloadAccess: AuthPayload = {
      sub: user.id,
      email: user.email,
      jti: randomUUID(),
      createdAt: Date.now(),
    };
    await this.setTokens(payloadAccess, user, res);

    return {
      message: 'Logged in',
    };
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (refreshToken) {
        const token = await this.prisma.refreshTokens.findUnique({
          where: { token: refreshToken },
        });
        if (token) {
          const result = await this.prisma.refreshTokens.delete({
            where: { token: refreshToken },
          });
        }
      }
      res.clearCookie('refresh_token');
      res.clearCookie('access_token');
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  async refreshToken(token: string, res: Response) {
    if (!token) throw new UnauthorizedException();
    const tokenResult = await this.prisma.refreshTokens.findUnique({
      where: { token },
    });
    if (!tokenResult) throw new UnauthorizedException();
    const user = await this.prisma.user.findUnique({
      where: { id: tokenResult.userId },
    });
    if (!user) throw new UnauthorizedException();
    await this.setTokens(
      {
        sub: user.id,
        email: user.email,
        jti: randomUUID(),
        createdAt: Date.now(),
      },
      user,
      res,
    );
    return true;
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Access token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
