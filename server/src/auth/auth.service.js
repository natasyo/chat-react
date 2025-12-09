"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const process = __importStar(require("node:process"));
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 12);
        return this.prisma.user.create({
            data: { email: registerDto.email, password: hashedPassword },
        });
    }
    async login(loginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });
        if (!user || !user.password)
            throw new common_1.UnauthorizedException();
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException();
        const payloadAccess = {
            sub: user.id,
            email: user.email,
            jti: (0, crypto_1.randomUUID)(),
            createdAt: Date.now(),
        };
        const accessToken = await this.jwtService.signAsync(payloadAccess, {
            secret: process.env.SECRET_KEY,
            expiresIn: '24h',
        });
        const payloadRefresh = {
            sub: user.id,
            email: user.email,
            jti: (0, crypto_1.randomUUID)(),
            createdAt: Date.now(),
        };
        const refreshToken = (0, crypto_1.randomUUID)().toString();
        const hashToken = await bcrypt.hash(refreshToken, 12);
        const result = await this.prisma.refreshTokens.create({
            data: {
                userId: user.id,
                token: hashToken,
            },
        });
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            email: user.email,
        };
    }
    async logout(logoutDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: logoutDto.email },
            });
            if (!user)
                return null;
            const tokens = await this.prisma.refreshTokens.findMany({
                where: { userId: user.id },
            });
            for (const token of tokens) {
                console.log(token);
                const isMatch = await bcrypt.compare(logoutDto.refreshToken, token.token);
                console.log(isMatch);
                if (isMatch) {
                    await this.prisma.refreshTokens.delete({
                        where: { id: token.id },
                    });
                }
            }
        }
        catch (error) {
            console.log('logout', error);
            throw new common_1.UnauthorizedException();
        }
    }
    async refreshToken(refreshDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: refreshDto.email },
            });
            if (!user)
                return null;
            const tokens = await this.prisma.refreshTokens.findMany({
                where: { userId: user.id },
            });
            for (const token of tokens) {
                const isMatch = await bcrypt.compare(refreshDto.refreshToken, token.token);
                console.log(isMatch);
                if (isMatch) {
                    const newAccessToken = await this.jwtService.signAsync({
                        sub: user.id,
                        email: user.email,
                        jti: (0, crypto_1.randomUUID)(),
                        createdAt: Date.now(),
                    });
                    const newRefreshToken = (0, crypto_1.randomUUID)().toString();
                    await this.prisma.refreshTokens.update({
                        where: { id: token.id },
                        data: { token: newRefreshToken },
                    });
                    return {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        email: user.email,
                    };
                }
            }
            return new common_1.UnauthorizedException();
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    async validateToken(token) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: process.env.SECRET_KEY,
            });
        }
        catch (err) {
            if (err instanceof jwt_1.TokenExpiredError) {
                console.log('asdkla;skdl;');
                throw new common_1.UnauthorizedException('Access token expired');
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map