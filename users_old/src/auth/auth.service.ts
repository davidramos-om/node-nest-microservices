import { Injectable, HttpException, HttpStatus } from '@nestjs/common';


import { RegistrationStatus } from './interfaces/regisration-status.interface';

import { UsersService } from '../user/users.service';
import { LoginStatus } from './interfaces/login-status.interface';

import { LoginUserDto } from '../user/dto/user-login.dto';
import { CreateUserDto } from '../user/dto/user.create.dto';
import { UserDto } from '../user/dto/user.dto';

import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';

import config from '../config';

@Injectable()
export class AuthService
{
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(userDto: CreateUserDto): Promise<RegistrationStatus>
    {
        let status: RegistrationStatus = {
            success: true,
            message: 'user registered',
        };

        try
        {
            await this.usersService.create(userDto);
        } catch (err)
        {
            status = {
                success: false,
                message: err,
            };
        }

        return status;
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginStatus>
    {
        const user = await this.usersService.findByLogin(loginUserDto);

        // generate and sign token
        const token = this._createToken(user);

        return {
            email: user.email,
            screen_name: user.screen_name,
            ...token,
        };
    }

    async validateUser(payload: JwtPayload): Promise<UserDto>
    {        
        console.info("validateUser", payload);
        const user = await this.usersService.findByPayload(payload);
        
        if (!user)
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        
        return user;
    }

    private _createToken({ id, email, screen_name, }: UserDto): any    
    {
        const expiresIn = config.EXPIRESIN;

        const user: JwtPayload = { email, screen_name, id };
        const accessToken = this.jwtService.sign(user);
        
        return {
            accessToken,
            expiresIn,
        };
    }
}