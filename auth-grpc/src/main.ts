import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { join } from 'path';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

const microservicesOptions = {
  transport: Transport.GRPC,
  options: {
    name: 'HERO_PACKAGE',
    url: '0.0.0.0:50051',
    protoPath: join(__dirname, '../src/proto/hero.proto'),
    package: 'hero',
  },
};

async function bootstrap()
{
  const app = await NestFactory.createMicroservice(
    AppModule,
    microservicesOptions,
  );
  await app.listen(() =>
  {
    logger.log('Auth GRPC Microservice is listening');
  });
}

bootstrap();
