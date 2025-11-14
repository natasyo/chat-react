import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WsException } from '@nestjs/websockets';
import { parseCookie } from '../common/functions/parseCookie';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = parseCookie(client.handshake.headers.cookie);
    if (!token) {
      throw new WsException('Token not provided.');
    }
    try {
      client.user = await this.authService.validateToken(token.access_token);
      return true;
    } catch (e) {
      console.log(e.message);
      throw new WsException(e.message || 'invalid_token');
    }
  }
}
