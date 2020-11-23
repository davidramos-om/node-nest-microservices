import { Controller, Get, Logger, OnModuleInit, Inject, Query, HttpException, HttpStatus, UseGuards, Post, UsePipes, ValidationPipe, Body, Req } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { AuthService } from './proto/auth.interface';


import config from './config';
import { AuthGuard_GRPC } from './guards/AuthGuard';

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
    return 'I am the User Microservice';
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async Login(@Body() dto: LoginUserDto)
  {
    this.logger.log("Call remote procedure", 'login');

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

    return this.authService.findUserByEmail({ email: email })
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

  @UseGuards(AuthGuard_GRPC)
  @Get('logged')
  async testAuth(): Promise<string>
  {
    return 'Congrats!! you are authorized';
  }

  @Get('whoami')
  @UseGuards(AuthGuard_GRPC)
  async WhoAmI(@Req() req: any)
  {
    this.logger.log("Call remote procedure", 'WhoAmI');

    const authorization = req.headers['authorization']?.split(' ')[1];

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
