import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

import config from '../config';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        ClientsModule.register([{
            name: config.micro.auth.name,
            transport: Transport.TCP,
            options: {
                host: config.micro.auth.HOST,
                port: config.micro.auth.PORT
            }
        }])
    ],
    providers: [UserService],
    controllers: [UserController],
})

export class UserModule { }