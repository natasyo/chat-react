import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    console.log(' handleRequest  ', user, err);
    if (err || user) {
      if (info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access Token Expired');
      }
      throw err || new UnauthorizedException('Invalid access token');
    }
    return user;
  }
}
