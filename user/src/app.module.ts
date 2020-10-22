import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';

import config from './config';

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
  }),
    UserModule],
})
export class AppModule { }