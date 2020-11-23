import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { join } from 'path';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

import config from './config';

const logger = new Logger('Main');

const microservicesOptions = {
  transport: Transport.GRPC,
  options: {
    name: config.micro.me,
    url: `${config.micro.me.HOST}:${config.micro.me.PORT}`,
    protoPath: join(__dirname, '../src/proto/auth.proto'),
    package: config.micro.me.package,
    loader: { keepCase: true },
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
    logger.log('Auth GRPC Microservice is listening ');
  });

}

bootstrap();
