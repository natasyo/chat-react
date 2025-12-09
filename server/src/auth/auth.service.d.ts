import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refreshTokenDto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        name: string | null;
        email: string;
        password: string;
        id: string;
        lastName: string | null;
        createdAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        email: string;
    }>;
    logout(logoutDto: LogoutDto): Promise<null | undefined>;
    refreshToken(refreshDto: RefreshTokenDto): Promise<UnauthorizedException | {
        accessToken: string;
        refreshToken: string;
        email: string;
    } | null>;
    validateToken(token: string): Promise<any>;
}
