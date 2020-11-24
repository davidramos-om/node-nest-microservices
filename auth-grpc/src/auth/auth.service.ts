import { HttpStatus, Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { Cache } from 'cache-manager';

import { LoginUserDto } from 'src/user/dto/login.dto';
import { LoginStatus } from 'src/user/login.status.dto';
import { UserEntity } from 'src/user/user.entity';
import { Exc, GrpcExc } from 'src/common/exceptions';
import { comparePasswords } from 'src/common/utils';

import config from 'src/config';
import { AccessToken, JwtPayload } from './payload.interface';

@Injectable()
export class AuthService
{
    constructor(

        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private readonly jwtService: JwtService,
    ) { }

    getToken(token: string): string
    {
        if (!token)
            return '';

        let jwt = token;
        if (jwt.startsWith('Bearer'))
            jwt = jwt.split(' ')[1];

        return jwt;
    }

    findOne(query: FindConditions<UserEntity>): Promise<UserEntity>
    {
        return this.userRepository.findOne(query);
    }

    private createToken(id: string, email: string, screen_name: string): AccessToken
    {
        const expiresIn = config.EXPIRESIN;

        const user: JwtPayload = { email, screen_name, id };
        const accessToken = this.jwtService.sign(user);

        return {
            accessToken,
            expiresIn,
        };
    }

    async validateToken(data: any): Promise<any>
    {
        if (!data || !data.jwt)
            throw GrpcExc('Token must be provided', HttpStatus.BAD_REQUEST);

        const jwt = this.getToken(data.jwt);
        const payload = this.jwtService.verify(jwt) as JwtPayload
        if (!payload)
            return null;

        const value = await this.cache.get(payload.email);
        if (!value)
            return null //Token was destroy

        if (jwt != value)
            return null;

        return payload
    }

    decodeToken(data: any): LoginStatus
    {
        if (!data || !data.jwt)
            throw GrpcExc('Token must be provided', HttpStatus.BAD_REQUEST);

        const jwt = this.getToken(data.jwt);

        const decode = this.jwtService.decode(jwt);
        if (!decode)
            throw GrpcExc('Invalid token.', HttpStatus.BAD_REQUEST);

        return {
            email: decode['email'],
            id: decode['id'],
            screen_name: decode['screen_name'],
            accessToken: data.jwt,
            expiresIn: decode['exp'],
        };
    }

    async Login(dto: LoginUserDto, isGrpc: boolean): Promise<LoginStatus>
    {
        if (!dto || !dto.email || !dto.password || !dto.app_id)
            throw Exc(isGrpc, 'Missing login information', HttpStatus.BAD_REQUEST);

        const cond = { email: dto.email, enabled: true, app_id: dto.app_id };
        const user = await this.findOne(cond);

        if (!user)
            throw Exc(isGrpc, 'User not found.', HttpStatus.NOT_FOUND);

        if (!user.id || !user.email)
            throw Exc(isGrpc, 'Invalid user data', HttpStatus.NOT_FOUND);

        const areEqual = await comparePasswords(dto.password, user.password);

        if (!areEqual)
            throw Exc(isGrpc, 'User not found or invalid credentials.', HttpStatus.UNAUTHORIZED);

        // generate and sign token
        const token = this.createToken(user.id, user.email, user.screen_name);

        const status = new LoginStatus();

        status.email = user.email;
        status.id = user.id;
        status.screen_name = user.screen_name;
        status.accessToken = token.accessToken;
        status.expiresIn = token.expiresIn

        this.cache.set(user.email, token.accessToken);

        return status;
    }

    async validateUser(email: string, password: string, app_id: string): Promise<any>  
    {
        try
        {
            const cond = { email: email, password: password, app_id: app_id, enabled: true };
            const user = await this.findOne(cond);
            const areEqual = await comparePasswords(password, user?.password);

            if (areEqual)
                return user;

            return null;
        } catch (e)
        {
            return null
        }
    }

    async logout(jwt: string)
    {
        try 
        {
            if (!jwt)
                return;

            jwt = this.getToken(jwt);

            const decode = this.jwtService.decode(jwt) as LoginStatus;
            if (!decode)
                return;

            this.cache.del(decode.email);
        }
        catch (error)
        {

        }
    }
}
