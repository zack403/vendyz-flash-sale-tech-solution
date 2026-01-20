import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('MAIN');

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({}));

  app.setGlobalPrefix('api/v1');

  await app.listen(3000);

  logger.log(
    `server running on ${await app.getUrl()} : ` + new Date().toISOString(),
  );
}

bootstrap();
