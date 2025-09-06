import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token =
      client.handshake?.auth?.token ||
      client.handshake?.headers?.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided.');
    }
    try {
      const payload = await this.authService.validateToken(token);
      client.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
