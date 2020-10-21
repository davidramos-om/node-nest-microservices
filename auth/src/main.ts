import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Transport } from '@nestjs/microservices/enums/transport.enum';

import
  {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import config from './config';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,    
    new FastifyAdapter({ logger: config.LOGGER }), {
    logger: console,
  });

  //Request-Response -> @MessagePattern
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: config.micro.mp.HOST,
      port: config.micro.mp.PORT
    }
  });
  
  await app.startAllMicroservicesAsync();

  await app.listen(config.PORT);

  Logger.log('Auth microservice running in port ' + config.PORT);
}

bootstrap();
