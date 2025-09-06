import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ChatGateway, ChatService, WsJwtGuard],
  imports: [AuthModule],
})
export class ChatModule {}
