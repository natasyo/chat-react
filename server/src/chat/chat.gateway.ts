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
import { User } from '@prisma/client';
import { parseCookie } from '../common/functions/parseCookie';

class JwtPayload {}

@WebSocketGateway({
  cors: {
    origin: ['https://localhost:5173', 'http://localhost:5173'],
    credentials: true,
  },
})
@UseFilters(SocketExceptionFilter)
@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
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
      const cookies = parseCookie(client.handshake.headers.cookie);
      const token =
        cookies['access_token'] || (client.handshake.query?.token as string);
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

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: MessageDTO) {
    this.server.emit('message', body);
  }

  @SubscribeMessage('private_message')
  async handlePrivateMessage(@MessageBody() body: MessagePrivateDTO) {
    const recipientSocketEmail = this.clients.get(body.recipientEmail);
    const senderSocketEmail = this.clients.get(body.senderEmail);
    const message = await this.chatService.savePrivateMessage(body);
    if (recipientSocketEmail) {
      this.server.to(recipientSocketEmail).emit('private_message', message);
    }
    if (senderSocketEmail) {
      this.server.to(senderSocketEmail).emit('private_message', message);
    } else {
      console.log(`⚠️ User ${body.recipientEmail} is offline`);
    }
  }

  @SubscribeMessage('get_private_message')
  async getPrivateMessages(
    @MessageBody() body: { sender: string; recipient: string },
  ) {
    const data = await this.chatService.getPrivateMessages(
      body.sender,
      body.recipient,
    );
    if (data) {
      const sender = this.clients.get(body.sender);
      if (sender) {
        this.server.to(sender).emit('get_private_message', data);
      }
    }
  }

  @SubscribeMessage('is_online')
  async getIsOnline(
    @MessageBody() body: { sender: string | User; users: User[] },
  ) {
    const senderEmail =
      typeof body.sender === 'object' && body.sender.email
        ? body.sender.email
        : (body.sender as string);
    if (body.users && body.users.length > 0 && body.sender) {
      const isOnlineUsers: { user: User; isOnline: boolean }[] = [];
      body.users.forEach((user: User) => {
        const recipient = this.clients.get(user.email);
        isOnlineUsers.push({ isOnline: !!recipient, user });
      });
      const sender = this.clients.get(senderEmail);
      if (sender) {
        this.server.to(sender).emit('is_online', isOnlineUsers);
      }
    }
  }
}
