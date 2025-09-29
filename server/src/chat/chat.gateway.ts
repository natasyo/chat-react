import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDTO } from './dto/MessageDTO';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { SocketExceptionFilter } from './socket-exception.filter';

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
})
@UseFilters(SocketExceptionFilter)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: MessageDTO) {
    console.log('Message', body);
    this.server.emit('message', body);
  }
}
