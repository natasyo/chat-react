import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(WsException)
export class SocketExceptionFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    console.log('exception');
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    client.emit('exception', { message: exception.message });
    console.log('------------exception');
  }
}
