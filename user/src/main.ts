import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as helmet from 'fastify-helmet';

import { Transport } from '@nestjs/microservices/enums/transport.enum';

import
{
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import config from './config';
import { Logger } from '@nestjs/common';


async function bootstrap()
{
  const httpsOptions = {
    key: fs.readFileSync('./secret/key.pem', 'utf8'),
    cert: fs.readFileSync('./secret/server.crt', 'utf8')
  };

  const serverOptions = { logger: config.LOGGER, https: httpsOptions, http2: true };
  const adapter = new FastifyAdapter(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
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

  //Security
  app.getHttpAdapter().getInstance().register(helmet);
  app.enableCors();

  await app.startAllMicroservicesAsync();

  await app.listen(config.PORT);

  Logger.log('User microservice running on http://localhost: ' + config.micro.mp.PORT);
  Logger.log(`Magic on http://localhost:${config.PORT}`, 'Bootstrap');
}

bootstrap();
