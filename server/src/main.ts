import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express from 'express';
import { join } from 'path';
import * as fs from 'node:fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((err) => ({
            field: err.property,
            errors: Object.values(err.constraints ?? {}),
          })),
        );
      },
    }),
  );
  // app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
