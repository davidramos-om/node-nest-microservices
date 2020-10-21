import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import config from 'src/config';
import { PostEntity } from './entity/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]),
  ClientsModule.register([{
    name: config.micro.auth.name,
    transport: Transport.TCP,
    options: {
      host: config.micro.auth.HOST,
      port: config.micro.auth.PORT
    }
  }])
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: []
})
export class PostsModule { }
