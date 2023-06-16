import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // if forbidNonWhitelisted === true, an error is returned
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(helmet());
  await app.listen(8888);
}
bootstrap();
