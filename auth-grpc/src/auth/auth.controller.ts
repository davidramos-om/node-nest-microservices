import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import config from 'src/config';
import { UserDto } from 'src/user/dto/user.dto';


interface HeroById
{
  id: number;
}

interface Hero
{
  id: number;
  name: string;
}
interface LoginUserDto
{
  email: string;
  password: string;
  app_id: string;
}
class LoginStatus
{
  id: string;
  email: string;
  screen_name: string;
  accessToken: string;
  expiresIn: string;
}
@Controller('auth')
export class AuthController
{

  @GrpcMethod(config.micro.me.serviceName, 'FindOne')
  findOne(data: HeroById): Hero
  {
    console.info('Auth-GRPC - Heroes-FindOne', data);

    const items = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Henry Smith' },
    ];

    return items.find(({ id }) => id === data.id);
  }

  @GrpcMethod(config.micro.me.serviceName, 'Login')
  Login(data: LoginUserDto): LoginStatus
  {
    console.info('Auth-GRPC - Login', data);

    const status = new LoginStatus();

    status.accessToken = '23832839283';
    status.email = data.email;
    status.expiresIn = "24h";
    status.id = "895823--034029";
    status.screen_name = "dramos";

    return status;
  }
}
