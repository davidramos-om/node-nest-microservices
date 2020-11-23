import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Body, HttpException, HttpStatus } from '@nestjs/common';


import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.create.dto';
import { RegistrationStatus } from './dto/regisration-status.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController
{
    constructor(private readonly userService: UserService) { }

    @Post('register')
    @UsePipes(ValidationPipe)
    public async register(@Body() createUserDto: CreateUserDto): Promise<RegistrationStatus>    
    {
        const result = await this.userService.createUser(createUserDto);

        if (!result.success)
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);

        return result;
    }
}