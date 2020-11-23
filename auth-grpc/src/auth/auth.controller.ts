import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { LoginStatus } from 'src/user/login.status.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login.dto';

import config from 'src/config';

@Controller('auth')
export class AuthController
{

  constructor(
    private readonly authService: AuthService) { }

  @GrpcMethod(config.micro.me.serviceName, 'Login')
  Login(dto: LoginUserDto): Promise<LoginStatus>
  {
    console.info("GRPC Auth  - Login")
    return this.authService.Login(dto);
  }

  @GrpcMethod(config.micro.me.serviceName, 'IsLoggedIn')
  IsLoggedIn(data: any): { loggedIn: boolean }
  {
    try
    {
      console.info("GRPC Auth  - IsLoggedIn")

      const res = this.authService.validateToken(data);

      return { loggedIn: res ? true : false };

    } catch (e)
    {
      return { loggedIn: false };
    }
  }

  @GrpcMethod(config.micro.me.serviceName, 'WhoAmI')
  async WhoAmI(data: any)
  {
    console.info("GRPC Auth  - WhoAmI")
    return this.authService.decodeToken(data);
  }
}
