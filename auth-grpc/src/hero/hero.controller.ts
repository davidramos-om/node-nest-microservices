import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from 'grpc';

interface HeroById
{
  id: number;
}

interface Hero
{
  id: number;
  name: string;
}

@Controller('hero')
export class HeroController
{
  @GrpcMethod('HeroesService', 'FindOne')
  findOne(data: HeroById,): Hero
  {
    console.info('Auth-GRPC - Heroes-FindOne', data);

    const items = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Henry Smith' },
    ];

    return items.find(({ id }) => id === data.id);
  }

  @Get() home()
  {
    return 'Hello grpc services'
  }
}
