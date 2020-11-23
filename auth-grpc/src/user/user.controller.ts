import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserDto } from './dto/user.dto';

import config from '../config';
import { UserService } from './user.service';

@Controller('user')
export class UserController
{
    constructor(private readonly userService: UserService) { }

    @GrpcMethod(config.micro.me.serviceName, 'FindUserByEmail')
    async FindUserByEmail(data: any): Promise<UserDto>
    {
        console.info('Auth-GRPC - FindUserByEmail', data.email);

        if (!data.email)
        {
            const exception = new RpcException({ message: 'Invalid email', status: 6 });
            throw exception;
        }

        const user = await this.userService.findOneByEmail(data.email);

        if (!user)
        {
            const exception = new RpcException({ message: 'User not found', status: 6 });
            throw exception;
        }

        var dto = new UserDto();
        dto = { ...user };
        return dto;
    }
}
