import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    switch (exception.code) {
      case 'P2002':
        return response.status(400).json({
          statusCode: 400,
          message: 'Record already exists',
          error: 'Conflict',
        });
      case 'P2025':
        return response.status(404).json({
          statusCode: 404,
          message: 'Record Not Found',
          error: 'Not Found',
        });
      default:
        return response.status(500).json({
          statusCode: 500,
          message: exception.message,
          error: 'Internal Server error',
        });
    }
  }
}
