import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
    imports: [PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'SECRET_KEY', // лучше через env
            signOptions: { expiresIn: '1h' },
        }),]

})
export class AuthModule {}

