import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { AuthGuard } from '../guards/AuthGuard';

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