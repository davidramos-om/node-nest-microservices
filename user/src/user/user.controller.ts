import { Controller, UseGuards, Get, Req, Post, UsePipes, ValidationPipe, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { AuthGuard } from '../guards/AuthGuard';
import { CreateUserDto } from './dto/user.create.dto';
import { RegistrationStatus } from './dto/regisration-status.interface';

@Controller('user')
export class UserController
{
    constructor(
        
        private readonly userService: UserService
    ) { }
    
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

    @Get()
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
}