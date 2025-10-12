import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { MessagePrivateDTO, MessageDTO } from './dto';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { SocketExceptionFilter } from './socket-exception.filter';
import jwt from 'jsonwebtoken';
import * as process from 'node:process';
import { ChatService } from './chat.service';

class JwtPayload {}

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
})
@UseFilters(SocketExceptionFilter)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients = new Map<string, string>();
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) {}
  handleDisconnect(client: Socket) {
    for (const [email, id] of this.clients.entries()) {
      if (id === client.id) {
        this.clients.delete(email);
        console.log(`❌ User ${email} disconnected`);
      }
    }
    console.log('Client disconnected', client.id);
  }

  handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        console.warn('no token provided');
        client.disconnect();
        return;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const email = decoded['email'];
      if (!email) {
        console.warn('no token provided');
        client.disconnect();
        return;
      }
      this.clients.set(email, client.id);
      console.log('Client connected', client.id, email);
    } catch (err) {
      console.error('❌ Invalid token:', err.message);
      client.disconnect();
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: MessageDTO) {
    console.log('Message', body);
    this.server.emit('message', body);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('private_message')
  async handlePrivateMessage(@MessageBody() body: MessagePrivateDTO) {
    const recipientSocketEmail = this.clients.get(body.recipientEmail);
    const senderSocketEmail = this.clients.get(body.senderEmail);
    const message = await this.chatService.savePrivateMessage(body);
    if (recipientSocketEmail && senderSocketEmail) {
      this.server.to(recipientSocketEmail).emit('private_message', message);
      this.server.to(senderSocketEmail).emit('private_message', message);
    } else {
      console.log(`⚠️ User ${body.recipientEmail} is offline`);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('get_private_message')
  async getPrivateMessages(
    @MessageBody() body: { userA: string; userB: string },
  ) {
    const data = await this.chatService.getPrivateMessages(
      body.userA,
      body.userB,
    );
    if (data) {
      const userA = this.clients.get(body.userA);
      const userB = this.clients.get(body.userB);
      if (userA && userB) {
        this.server.to(userA).emit('get_private_message', data);
        this.server.to(userB).emit('get_private_message', data);
      }
    }
  }
}
