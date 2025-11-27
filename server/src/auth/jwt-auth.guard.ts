import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as process from 'node:process';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const token = req.cookies?.access_token;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      req.user = await this.jwt.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
