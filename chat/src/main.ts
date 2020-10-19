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

import * as typeorm from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { PostEntity } from './post/entity/post.entity';
import { UserEntity } from './user/entity/user.entity';

async function bootstrap() {

  //Express
  // const app = await NestFactory.create(AppModule);


  // const core_connection = await typeorm.createConnection({
  //   type: "postgres",
  //   host: config.db.core.host,
  //   port: config.db.core.port,
  //   username: config.db.core.username,
  //   password: config.db.core.port,
  //   database: config.db.core.database,
  //   synchronize: config.db.core.synchronize,
  //   logging: config.db.core.logging,
  //   entities: [PostEntity]
  // } as any as PostgresConnectionOptions);

  // const regional_connection = await typeorm.createConnection({
  //     type: "postgres",
  //     host: config.db.regional.host,
  //     port: config.db.regional.port,
  //     username: config.db.regional.username,
  //     password: config.db.regional.port,
  //     database: config.db.regional.database,
  //     synchronize: config.db.regional.synchronize,
  //     logging: config.db.regional.logging,
  //     entities: [UserEntity]
  //   } as unknown  as PostgresConnectionOptions);


  // const regional = await DbConnectionOptions(config.db.regional.name);
  // const core = await DbConnectionOptions(config.db.core.name);
  
  //Fastify
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule.forRoot(),    
    new FastifyAdapter({ logger: config.LOGGER }), {
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

  // app.use(logger); //Global middleware

  //Standar app
  // app.useGlobalGuards(new RolesGuard());

  //MicroSerices 
  // https://docs.nestjs.com/faq/hybrid-application

  await app.listen(config.PORT);

  Logger.log(`Magic on http://localhost:${config.PORT}`, 'Bootstrap');
}

bootstrap();
