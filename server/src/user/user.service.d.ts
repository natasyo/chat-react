import { PrismaService } from '../prisma/prisma.service';
import { UserUpdateOneSchema } from '@app/shared';
import { z } from 'zod';
export type UserUpdateOneType = z.infer<typeof UserUpdateOneSchema>;
export declare class UserService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getUser(email: string): Promise<{
        name: string | null;
        email: string;
        password: string;
        id: string;
        lastName: string | null;
        createdAt: Date;
    } | null>;
    updateUser(id: string, data: UserUpdateOneType): Promise<{
        name: string | null;
        email: string;
        password: string;
        id: string;
        lastName: string | null;
        createdAt: Date;
    }>;
}
