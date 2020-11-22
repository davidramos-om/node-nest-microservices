import { Controller, UseGuards, Get, Req, Post, UsePipes, ValidationPipe, Body, HttpException, HttpStatus, Logger, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { AuthGuard } from '../guards/AuthGuard';
import { CreateUserDto } from './dto/user.create.dto';
import { RegistrationStatus } from './dto/regisration-status.interface';
import { ApiTags } from '@nestjs/swagger';

// import { IGrpcService } from '../grpc.interface';
// import { Client, ClientGrpc } from '@nestjs/microservices';
// import { microserviceOptions } from '../grpc.options';


@Controller('user')
@ApiTags('user')
export class UserController
{
    // private logger = new Logger('UserController');

    // @Client(microserviceOptions)
    // private client: ClientGrpc;
    // private grpcService: IGrpcService;

    constructor(private readonly userService: UserService) { }

    // onModuleInit()
    // {
    //     this.grpcService = this.client.getService<IGrpcService>('AppController');
    // }

    @MessagePattern({ role: 'user', cmd: 'get' })
    getUser(data: any): Promise<UserEntity>
    {
        // console.info("user microservices.getUser", data);

        if (!data || !data.email)
            return null;

        return this.userService.findOne({ email: data.email, enabled: true, app_id: data.app_id });
    }

    @MessagePattern({ role: 'user', cmd: 'email' })
    getUserByEmail(data: any): Promise<UserEntity>
    {
        if (!data.email)
            return null;

        return this.userService.findOneByEmail(data.email);
    }

    @Get('hello')
    getHello(): string
    {
        return this.userService.getHello();
    }

    @Post('register')
    @UsePipes(ValidationPipe)
    public async register(@Body() createUserDto: CreateUserDto): Promise<RegistrationStatus>    
    {
        const result = await this.userService.createUser(createUserDto);

        if (!result.success)
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);

        return result;
    }

    @UseGuards(AuthGuard)
    @Get('logged')
    async testAuth(): Promise<string>
    {
        return 'Congrats!! you are authorized';
    }

    @UseGuards(AuthGuard)
    @Get('whoami')
    async Whoami(@Req() req: any): Promise<any>
    {
        const header = req.headers['authorization']?.split(' ')[1];

        return this.userService.getLoguedUserInfo(header);
    }

    // @Post('sum')
    // @UsePipes(ValidationPipe)
    // async accumulate(@Body('data') data: number[])
    // {
    //     this.logger.log('grpc Client - send data :  ' + data);

    //     return this.grpcService.accumulate({ data });
    // }
}