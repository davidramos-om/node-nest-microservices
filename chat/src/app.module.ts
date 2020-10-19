import { DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// import { LoggerMiddleware, logger } from './common/middleware/logger.middleware';

// import { PostController } from './post/post.controller';
// import { PostService } from './post/post.service';

import { PostsModule } from './post/posts.module';
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
import { PostEntity } from './post/entity/post.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

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

// const regional = TypeOrmModule.forRoot({
//   type: 'postgres',
//   name: "regionalConnection",
//   host: config.db.regional.host,
//   port: config.db.regional.port,
//   username: config.db.regional.username,
//   password: config.db.regional.password,
//   database: config.db.regional.database,
//   // entities: [__dirname + "/**/entity/*.js"],
//   synchronize: config.db.regional.synchronize,
//   entities: [UserEntity, PostEntity],
// });

@Module({})
export class AppModule
{
  
  static forRoot(): DynamicModule    
  {
    return {
      module: AppModule,
      controllers: [AppController],
      imports: [

        // TypeOrmModule.forRoot({
        //   type: 'postgres',
        //   host: config.db.regional.host,
        //   port: config.db.regional.port,
        //   username: config.db.regional.username,
        //   password: config.db.regional.password,
        //   database: config.db.regional.database,
        //   // entities: [__dirname + "/**/entity/*.js"],
        //   entities: [UserEntity, PostEntity],
        //   synchronize: config.db.regional.synchronize,
        // }),

        // regional_cnn,
        // core_cnn,

        TypeOrmModule.forRootAsync({
          // name :"regional",
          useFactory: () => ({
            type: 'postgres',
            name: "regional",
            host: config.db.regional.host,
            port: config.db.regional.port,
            username: config.db.regional.username,
            password: config.db.regional.password,
            database: config.db.regional.database,
            // entities: [__dirname + "/**/entity/*.js"],
            entities: [UserEntity,],
            synchronize: config.db.regional.synchronize,
            autoLoadEntities: false,
          }),
        }),

        TypeOrmModule.forRootAsync({
          // name: "core",        
          useFactory: () => ({
            type: 'postgres',
            name: "core",
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
        }),

        // TypeOrmModule.forRoot({ name: "regional", autoLoadEntities: true, entities: [UserEntity] }),                
        // TypeOrmModule.forRoot({ name: "core", autoLoadEntities: true, entities: [PostEntity] }),   
        
        AuthModule,
        PostsModule,
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