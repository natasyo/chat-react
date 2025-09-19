import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token =
      client.handshake?.auth?.token ||
      client.handshake?.headers?.authorization?.split(' ')[1];
    if (!token) {
      throw new WsException('Token not provided.');
    }

    try {
      const payload = await this.authService.validateToken(token);
      console.log('payload', payload);
      client.user = payload;
      return true;
    } catch (e) {
      console.log(e.message);
      throw new WsException(e.message || 'invalid_token');
    }
  }
}
