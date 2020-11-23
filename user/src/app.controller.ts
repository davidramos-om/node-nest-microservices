import { Controller, Get, Logger, OnModuleInit, Inject, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { Observable } from 'rxjs';
import { AuthService } from './proto/auth.interface';


import config from './config';
import { AuthGuard_GRPC, AuthGuard_MsgPattern } from './guards/AuthGuard';

export class LoginUserDto
{
  email: string;
  password: string;
  app_id: string;
}

@Controller()
export class AppController implements OnModuleInit
{
  private logger = new Logger('AppController');

  private authService: AuthService;
  constructor(@Inject(config.micro.auth.name) private client: ClientGrpc) { }

  onModuleInit()
  {
    this.authService = this.client.getService<AuthService>(config.micro.auth.serviceName);
  }

  @Get()
  getHello(): string
  {
    return 'Hello World!!@';
  }

  @Get('login')
  async Login()
  {
    this.logger.log("Call remote procedure", 'login');

    const dto = new LoginUserDto();
    dto.app_id = "0e5aea12-c3a9-4a0a-a80c-54343148d4cd";
    dto.email = "david.ramos@develappglobal.com";
    dto.password = "ASdf1234";

    return this.authService.login(dto)
      .toPromise()
      .then((result) =>
      {
        return new Promise<any>((resolve) =>
        {
          resolve(result);
        });

      }).catch((err) =>
      {
        throw new HttpException({ status: err.code, error: err.details, }, err.code);
      })
  }

  @Get('FindByEmail')
  @UseGuards(AuthGuard_GRPC)
  async FindByEmail(@Query('email') email: string)
  {
    this.logger.log("Call remote procedure", 'FindByEmail');

    if (!email)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: 'Set a valid email', }, HttpStatus.BAD_REQUEST);

    console.time('FindByEmail');
    return this.authService.findUserByEmail({ email: email })
      .toPromise()
      .then((result) =>
      {
        console.timeEnd('FindByEmail');
        return new Promise<any>((resolve) =>
        {
          resolve(result);
        });

      }).catch((err) =>
      {
        throw new HttpException({ status: err.code, error: err.details, }, err.code);
      })
  }


  @Get('whoami')
  @UseGuards(AuthGuard_GRPC)
  async WhoAmI(@Query('authorization') authorization: string)
  {
    this.logger.log("Call remote procedure", 'WhoAmI');

    if (!authorization)
      throw new HttpException({ status: HttpStatus.UNAUTHORIZED }, HttpStatus.UNAUTHORIZED);

    const jwt = authorization.startsWith('Bearer') ? authorization?.split(' ')[1] : authorization;

    return this.authService.whoAmI({ jwt })
      .toPromise()
      .then((result) =>
      {
        return new Promise<any>((resolve) =>
        {
          resolve(result);
        });

      }).catch((err) =>
      {
        throw new HttpException({ status: err.code, error: err.details, }, err.code);
      })
  }
}
