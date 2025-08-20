import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

function extractValidationErrors(errors, parentProperty = '') {
  return errors.flatMap((error) => {
    const propertyPath = parentProperty
      ? `${parentProperty}.${error.property}`
      : error.property;

    const messages = [];

    if (error.constraints) {
      messages.push(
        ...Object.values(error.constraints).map((msg) => ({
          property: propertyPath,
          message: msg,
        })),
      );
    }

    if (error.children && error.children.length > 0) {
      messages.push(...extractValidationErrors(error.children, propertyPath));
    }

    return messages;
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3001', // Desarrollo
      'https://cloudnel.com', // Frontend en producción
      'https://api.cloudnel.com', // Backend
    ],
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser()); // Habilita el guard de cookies
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = extractValidationErrors(errors);
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
