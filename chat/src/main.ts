import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DbConnectionOptions } from './common/db';

import * as helmet from 'helmet';

import
  {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
 

import { AppModule } from './app.module';
import "reflect-metadata";

import config from '../config';

async function bootstrap() {

  //Express
  // const app = await NestFactory.create(AppModule);

  //Fastify
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule.forRoot(await DbConnectionOptions(config.ENVIROMENT)),
    new FastifyAdapter({ logger: config.LOGGER }), {
    logger: console,
  }
  );

  app.use(helmet());

  app.enableCors();

  //Apply validation for all inputs globally
  app.useGlobalPipes(
    new ValidationPipe({      
      whitelist: true,
      transform: true,
    }),
  );

  // app.use(logger); //Global middleware

  //Standar app
  // app.useGlobalGuards(new RolesGuard());

  //MicroSerices 
  // https://docs.nestjs.com/faq/hybrid-application

  await app.listen(config.PORT);

  Logger.log(`Magic on http://localhost:${config.PORT}`, 'Bootstrap');
}

bootstrap();
