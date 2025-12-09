import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Profile } from '@prisma/client';
import type { Express, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers() {
    console.log('get users');
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get users');
    }
  }
  @Get('by-email')
  async getUser(@Query('email') email: string) {
    return await this.userService.getUser(email);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename(
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const ext = path.extname(file.originalname);
          const baseName = path.basename(file.originalname, ext);
          const fileName = `${baseName}_${Date.now()}${ext}`;
          console.log(fileName);
          callback(null, fileName);
        },
      }),
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @Body() body: object,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const profile = JSON.parse(body['user']) as Profile;
      console.log(profile);
      if (file) {
        console.log(file.originalname);
        profile.photo = file.filename;
        console.log(profile);
      }

      return await this.userService.updateProfile(id, { ...profile });
    } catch (err) {
      console.error('Error in updateUser:', err); // 🔥 логируем
      throw new InternalServerErrorException('Something went wrong on server');
    }
  }
}
