import { DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// import { LoggerMiddleware, logger } from './common/middleware/logger.middleware';

// import { PostController } from './post/post.controller';
// import { PostService } from './post/post.service';

import { PostModule } from './post/post.module';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './core/core.module';
import { ConnectionOptions } from 'typeorm';
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-fastify-rate-limiter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserEntity } from './user/entity/user.entity';
import { AuthService } from './auth/auth.service';
import { UsersService } from './user/users.service';

import config from '../config';

// @Module({
//   imports: [PostModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


// @Module({
//   imports: [PostModule, UserModule, AuthModule, CoreModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule implements NestModule {
  
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       // .apply(LoggerMiddleware)
//       .apply(logger)
//       // .forRoutes('posts'); // all /posts/ routes in posts
//       .forRoutes(PostController) // the controller
//       // .forRoutes({ path: 'posts', method: RequestMethod.GET }); // get routes in post controller
//   }
// }

@Module({})
export class AppModule
{
  static forRoot(connOptions: ConnectionOptions): DynamicModule
  {
    return {
      module: AppModule,
      controllers: [AppController],
      imports: [        
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: config.db.host,
          port: config.db.port,
          username: config.db.username,
          password: config.db.password,
          database: config.db.database,
          // entities: [__dirname + "/**/entity/*.js"],
          entities: [UserEntity],
          synchronize: config.db.synchronize,
        }),
        AuthModule,
        PostModule,
        UsersModule,
        // CoreModule,
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