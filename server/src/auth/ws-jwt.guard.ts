import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthPayload, AuthService } from './auth.service';
import { WsException } from '@nestjs/websockets';
import { parseCookie } from '../common/functions/parseCookie';
import { Reflector } from '@nestjs/core';
import { WS_PUBLIC_KEY } from './decorators/ws-public.decorator';
import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
  user?: AuthPayload;
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(WS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }

    const client = context.switchToWs().getClient();
    const cookies = client.handshake.headers.cookie;
    if (!cookies) {
      throw new WsException('Cookie not found');
    }

    const token = parseCookie(cookies).access_token;
    if (!token) {
      throw new WsException('Token not provided.');
    }
    try {
      client.user = await this.authService.validateToken(token);
      return true;
    } catch (e) {
      console.log(e.message);
      throw new WsException(e.message || 'invalid_token');
    }
  }
}
