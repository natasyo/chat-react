import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDTO } from './dto/MessageDTO';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket): void;
    handleMessage(body: MessageDTO): void;
}
