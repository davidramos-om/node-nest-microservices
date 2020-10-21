import { DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerMiddleware, logger } from './common/middleware/logger.middleware';


import { TypeOrmModule } from '@nestjs/typeorm';

import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-fastify-rate-limiter';
import { APP_INTERCEPTOR } from '@nestjs/core';

import config from './config';
import { PostEntity } from './post/entity/post.entity';
import { PostsModule } from './post/posts.module';


// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: config.db.core.host,
//       port: config.db.core.port,
//       username: config.db.core.username,
//       password: config.db.core.password,
//       database: config.db.core.database,
//       // entities: [__dirname + "/**/entity/*.js"],
//       entities: [PostEntity,],
//       synchronize: config.db.core.synchronize,
//       autoLoadEntities: false,
//     }),
//     RateLimiterModule.register({
//       points: 100,
//       duration: 60,
//       type: 'Memory',
//       errorMessage: 'Too many requests, please try again later.',
//       keyPrefix: 'global',
//     }),
//   ],
//   controllers: [AppController],
//   providers: [AppService,
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: RateLimiterInterceptor,
//     }],
// })
  
// export class AppModule implements NestModule
// {  
//   configure(consumer: MiddlewareConsumer)
//   {
//     consumer      
//       .apply(logger, LoggerMiddleware)      
//       // .forRoutes('posts'); // all /posts/ routes in posts
//       .forRoutes(PostsController) // the controller
//     // .forRoutes({ path: 'posts', method: RequestMethod.GET }); // get routes in post controller
//   }
  
// }
 

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
          host: config.db.core.host,
          port: config.db.core.port,
          username: config.db.core.username,
          password: config.db.core.password,
          database: config.db.core.database,
          // entities: [__dirname + "/**/entity/*.js"],
          entities: [PostEntity,],
          synchronize: config.db.core.synchronize,
          autoLoadEntities: false,
        }),

        PostsModule,
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