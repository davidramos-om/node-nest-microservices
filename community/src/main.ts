import 'dotenv/config';
import "reflect-metadata";

import * as fs from 'fs';
import * as helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';



import
{
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';


import { AppModule } from './app.module';


import config from './config';


async function bootstrap()
{

  //Express
  // const app = await NestFactory.create(AppModule);


  // const httpsOptions = {
  //   key: fs.readFileSync('./key.pem'),
  //   cert: fs.readFileSync('./public_key.pem'),
  // };

  const httpsOptions = {
    key: fs.readFileSync('./key.pem', 'utf8'),
    cert: fs.readFileSync('./server.crt', 'utf8')
  };


  //Fastify
  const serverOptions = { logger: config.LOGGER, https: httpsOptions, http2: true };
  // const server = fastify();
  const adapter = new FastifyAdapter(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule.forRoot(),
    adapter,
    {
      logger: console,
    });

  app.use(helmet());

  app.enableCors();


  //Apply validation for all inputs globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );


  await app.listen(config.PORT);
  // await app.init();

  // await https.createServer(httpsOptions).listen(443);

  Logger.log(`Magic on http://localhost:${config.PORT}`, 'Bootstrap');
}

bootstrap();
