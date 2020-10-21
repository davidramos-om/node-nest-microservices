import { DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-fastify-rate-limiter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserEntity } from './user/entity/user.entity';

import config from './config';


@Module({})
export class AppModule
{
  
  static forRoot(): DynamicModule    
  {
    return {
      module: AppModule,
      controllers: [AppController],
      imports: [
      
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: config.db.regional.host,
          port: config.db.regional.port,
          username: config.db.regional.username,
          password: config.db.regional.password,
          database: config.db.regional.database,
          // entities: [__dirname + "/**/entity/*.js"],
          entities: [UserEntity,],
          synchronize: config.db.regional.synchronize,
          autoLoadEntities: false
        }),
        AuthModule,
        UsersModule,
        RateLimiterModule.register({
          points: 100,
          duration: 60,
          type: 'Memory',
          errorMessage: 'Too many requests, please try again later.',
          keyPrefix: 'global',
        }),
      ],
      
      providers: [
        AppService,
        {
          provide: APP_INTERCEPTOR,
          useClass: RateLimiterInterceptor,
        }],
    };
  }
}