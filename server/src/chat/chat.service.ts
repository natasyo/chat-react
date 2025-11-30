import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessagePrivateDTO } from './dto';
import { Message } from '@prisma/client';

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
  async updatePrivateMessage(messageId: string, message: Partial<Message>) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: message,
    });
  }
  async getNewCountMessages(userEmail: string) {
    const data = await this.prisma.message.groupBy({
      by: ['senderEmail'],
      where: {
        recipientEmail: userEmail,
        OR: [{ state: 'DELIVERED' }, { state: 'SENT' }],
      },
      _count: {
        id: true,
      },
    });
    return data.map((item) => ({
      senderEmail: item.senderEmail,
      count: item._count.id,
    }));
  }
}
