import { Controller, Get, Logger, Post, Body, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

// import { IGrpcService } from './grpc.interface';
// import { Client, ClientGrpc } from '@nestjs/microservices';
// import { microserviceOptions } from './grpc.options';
import config from './config';

class LoginUserDto
{
  email: string;
  password: string;
  app_id: string;
}

interface AuthService
{
  findOne(data: { id: number }): Observable<any>;
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
}
