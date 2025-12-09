import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refreshTokenDto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        name: string | null;
        email: string;
        password: string;
        id: string;
        lastName: string | null;
        createdAt: Date;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        email: string;
    }>;
    logout(dto: LogoutDto, req: Request): Promise<null | undefined>;
    refreshToken(dto: RefreshTokenDto, req: Request): Promise<import("@nestjs/common").UnauthorizedException | {
        accessToken: string;
        refreshToken: string;
        email: string;
    } | null>;
}
