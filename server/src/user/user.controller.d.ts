import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(email: string): Promise<{
        name: string | null;
        email: string;
        password: string;
        id: string;
        lastName: string | null;
        createdAt: Date;
    } | null>;
    updateUser(id: string, user: unknown): Promise<{
        name: string | null;
        email: string;
        password: string;
        id: string;
        lastName: string | null;
        createdAt: Date;
    }>;
}
