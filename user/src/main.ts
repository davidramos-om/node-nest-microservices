import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';


import * as fs from 'fs';
import * as helmet from 'fastify-helmet';

import { Transport } from '@nestjs/microservices/enums/transport.enum';

import
{
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import config from './config';
import { AppModule } from './app.module';
import { SetupDocs } from './docs';


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
      host: config.micro.me.HOST,
      port: config.micro.me.PORT
    }
  });

  if (config.ENVIROMENT !== 'production' && config.GEN_DOCS)
    SetupDocs(app);

  //Security
  if (config.ENVIROMENT === 'production')
    app.getHttpAdapter().getInstance().register(helmet);

  app.enableCors();

  await app.startAllMicroservicesAsync();

  await app.listen(config.PORT);

  Logger.log('User microservice running on https://localhost:' + config.micro.me.PORT);
  Logger.log(`Api Docs is on ${await app.getUrl()}/${config.DOCS_ENDPOINT}`, 'Documentation');
  Logger.log(`Magic on ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap();
