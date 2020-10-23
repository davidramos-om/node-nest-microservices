import 'dotenv/config';
import 'reflect-metadata';

import * as fs from 'fs';
import * as helmet from 'fastify-helmet';

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import
{
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';


import { AppModule } from './app.module';
import config from './config';
import { Transport } from '@nestjs/microservices';
import { SetupDocs } from './docs';


async function bootstrap()
{

  //Express
  // const app = await NestFactory.create(AppModule);


  const httpsOptions = {
    key: fs.readFileSync('./secret/key.pem', 'utf8'),
    cert: fs.readFileSync('./secret/server.crt', 'utf8')
  };


  //Fastify
  const serverOptions = { logger: config.LOGGER, https: httpsOptions, http2: true };
  const adapter = new FastifyAdapter(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule.forRoot(),
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

  if (config.ENVIROMENT !== 'production' && config.GEN_DOCS)
    SetupDocs(app);

  //Security
  if (config.ENVIROMENT === 'production')
    app.getHttpAdapter().getInstance().register(helmet);

  app.enableCors();


  await app.listen(config.PORT);

  Logger.log('Community microservice running on http://localhost: ' + config.micro.mp.PORT);
  Logger.log(`Magic on ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap();
