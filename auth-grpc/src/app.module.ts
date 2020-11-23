import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';

import config from './config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot({
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
