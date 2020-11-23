
import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/user.entity';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { LocalStrategy } from "./local.strategy";
import config from 'src/config';



@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            secret: config.JWT_SECRETKEY,
            signOptions: { expiresIn: config.EXPIRESIN },

        })
    ],
    controllers: [AuthController],
    providers: [AuthService, Logger],
})
export class AuthModule { }