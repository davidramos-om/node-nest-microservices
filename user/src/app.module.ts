import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-fastify-rate-limiter';
import { APP_INTERCEPTOR } from '@nestjs/core';


import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';

import config from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    port: config.db.regional.port,
    host: config.db.regional.host,
    username: config.db.regional.username,
    password: config.db.regional.password,
    database: config.db.regional.database,
    synchronize: config.db.regional.synchronize,
    entities: [UserEntity,]
  },
  ),
  RateLimiterModule.register({
    points: 100,
    duration: 60,
    type: 'Memory',
    errorMessage: 'Too many requests, please try again later.',
    keyPrefix: 'global',
  }),
    UserModule,
  ClientsModule.register([
    {
      name: 'HERO_PACKAGE',
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        package: 'hero',
        protoPath: join(__dirname, '../src/proto/hero.proto'),
      },
    },
  ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    }
  ],

})
export class AppModule { }