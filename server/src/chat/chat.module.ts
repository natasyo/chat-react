import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ChatGateway, ChatService, WsJwtGuard, PrismaService],
  imports: [AuthModule],
})
export class ChatModule {}
