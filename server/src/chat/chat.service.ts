import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessagePrivateDTO } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  async savePrivateMessage(message: MessagePrivateDTO) {
    return this.prisma.message.create({
      data: {
        senderEmail: message.senderEmail,
        text: message.text,
        recipientEmail: message.recipientEmail,
      },
      include: {
        sender: true,
        recipient: true,
      },
    });
  }
  async getPrivateMessages(userA: string, userB: string) {
    console.log(userA, userB);
    return this.prisma.message.findMany({
      where: {
        OR: [
          { recipientEmail: userA, senderEmail: userB },
          { recipientEmail: userB, senderEmail: userA },
        ],
      },
    });
  }
}
