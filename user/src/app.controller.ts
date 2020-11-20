import { Controller, Get, Logger, Post, Body, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

// import { IGrpcService } from './grpc.interface';
// import { Client, ClientGrpc } from '@nestjs/microservices';
// import { microserviceOptions } from './grpc.options';

interface HeroesService
{
  findOne(data: { id: number }): Observable<any>;
}

@Controller()
export class AppController implements OnModuleInit
{
  private logger = new Logger('AppController');

  private heroesService: HeroesService;
  constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc) { }



  onModuleInit()
  {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
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
    const data = this.heroesService.findOne({ id: 1 });
    data.toPromise().then((result) =>
    {
      this.logger.log("result to promise", result);
    });

    return data;
  }
}
