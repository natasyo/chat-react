import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async getUser(email: string) {
    try {
      const result = await this.prismaService.user.findUnique({
        where: { email },
        include: { profile: true },
      });
      return result;
    } catch (e) {
      console.error(e);
      throw new Error(`Failed to get user with email: ${email}`);
    }
  }

  async getAllUsers() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        profile: true,
      },
    });
  }

  async updateProfile(userUpdateId: string, data: Profile) {
    const { userId, id, ...safeData } = data;
    return this.prismaService.user.update({
      where: { id: userUpdateId },
      data: {
        profile: {
          upsert: {
            create: { ...safeData },
            update: { ...safeData },
          },
        },
      },
      include: { profile: true },
    });
  }
}
