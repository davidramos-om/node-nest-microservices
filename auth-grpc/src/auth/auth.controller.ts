import { Body, Controller, Post, UsePipes, ValidationPipe, Logger, Headers } from '@nestjs/common';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';

import { LoginStatus } from 'src/user/login.status.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login.dto';

import config from 'src/config';

@Controller('auth')
export class AuthController
{

  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger
  ) { }

  @Post('Login')
  @UsePipes(ValidationPipe)
  Login_Http(@Body() dto: LoginUserDto)
  {
    this.logger.log("HTTP-Auth  - Login")
    return this.authService.Login(dto, false);
  }

  @MessagePattern({ role: 'auth', cmd: 'login' })
  Login_Tpc(@Body() dto: LoginUserDto)
  {
    this.logger.log("TCP-Auth  - Login")
    return this.authService.Login(dto, false);
  }

  @GrpcMethod(config.micro.me.serviceName, 'Login')
  Login_Grpc(dto: LoginUserDto): Promise<LoginStatus>
  {
    this.logger.log("GRPC-Auth  - Login")
    return this.authService.Login(dto, true);
  }

  @Post('logout')
  Logout_Http(@Headers('authorization') authorization: string)
  {
    this.logger.log("HTTP-Auth  - logout")

    if (!authorization)
      return;

    this.authService.logout(authorization)
  }

  @GrpcMethod(config.micro.me.serviceName, 'IsLoggedIn')
  async IsLoggedIn(data: any): Promise<any>
  {
    try
    {
      this.logger.log("GRPC-Auth  - IsLoggedIn")

      const res = await this.authService.validateToken(data);

      return { loggedIn: res ? true : false };

    } catch (e)
    {
      return { loggedIn: false };
    }
  }

  @GrpcMethod(config.micro.me.serviceName, 'WhoAmI')
  async WhoAmI(data: any)
  {
    this.logger.log("GRPC Auth  - WhoAmI")
    return this.authService.decodeToken(data);
  }
}
