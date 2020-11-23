import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController
{

    @Get()
    Welcome(): any
    {
        return 'I am the Auth Microservice';
    }
}
