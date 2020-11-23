import { Controller, Get, Logger, Post, Body, OnModuleInit, Inject, Req, Query, HttpException, UseFilters, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { resolveAny } from 'dns';
import { Observable } from 'rxjs';
import { GrpcExceptionFilter } from './common/exceptions';

import config from './config';

class LoginUserDto
{
  email: string;
  password: string;
  app_id: string;
}

//Important : must start with lowercase
interface AuthService
{
  findOne(data: { id: number }): Observable<any>;
  findUserByEmail(data: { email: string }): Observable<any>;
  login(data: LoginUserDto): Observable<any>;
}



@Controller()
export class AppController implements OnModuleInit
{
  private logger = new Logger('AppController');

  private authService: AuthService;
  constructor(@Inject(config.micro.auth.name) private client: ClientGrpc) { }

  onModuleInit()
  {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Get()
  getHello(): string
  {
    // return this.appService.getHello();
    return 'Hello World!!@';
  }

  @Get('findOne')
  getHero(): Observable<string>
  {
    this.logger.log("Call remote procedure", 'findOne');
    const data = this.authService.findOne({ id: 1 });
    data.toPromise().then((result) =>
    {
      this.logger.log("result to promise", result);
    });

    return data;
  }

  @Get('login')
  login(): Observable<any>
  {
    this.logger.log("Call remote procedure", 'login');

    const dto = new LoginUserDto();
    dto.app_id = "0e5aea12-c3a9-4a0a-a80c-54343148d4cd";
    dto.email = "davidramos015@gmail.com";
    dto.password = "ASdf1234";

    const data = this.authService.login(dto);
    // data.toPromise().then((result) =>
    // {
    //   this.logger.log("result to promise", result);
    // });

    return data;
  }

  @Get('FindByEmail')
  async FindByEmail(@Query('email') email: string)
  {
    this.logger.log("Call remote procedure", 'FindByEmail');

    if (!email)
      throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'Set a valid email', }, HttpStatus.FORBIDDEN);

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
        throw new HttpException({ status: HttpStatus.FAILED_DEPENDENCY, error: err.details, }, HttpStatus.FAILED_DEPENDENCY);
      })
  }
}
