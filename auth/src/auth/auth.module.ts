import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";

import config from '../config';

@Module({
  imports: [ClientsModule.register([{
    name: config.micro.users.name,
    transport: Transport.TCP,
    options: {
      host: config.micro.users.HOST,
      port: config.micro.users.PORT
    }
  }]), JwtModule.register({
    secret: config.JWT_SECRETKEY,
    signOptions: { expiresIn: config.EXPIRESIN }
  })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule { }