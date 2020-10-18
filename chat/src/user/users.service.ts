import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { toUserDto } from '../common/mapper';
import { CreateUserDto } from './dto/user.create.dto';
import { LoginUserDto } from './dto/user-login.dto';
import { comparePasswords } from '../common/utils';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService
{
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) { }

    async findOne(options?: object): Promise<UserDto>
    {
        const user = await this.userRepo.findOne(options);
        return toUserDto(user);
    }

    async findByLogin({ email, password }: LoginUserDto): Promise<UserDto>
    {
        const user = await this.userRepo.findOne({ where: { email: email, enabled: true } });
        
        if (!user)
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        
        const areEqual = await comparePasswords(user.password, password);

        if (!areEqual)
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

        return toUserDto(user);
    }

    async findByPayload({ email }: JwtPayload): Promise<UserDto>
    {
        return await this.findOne({ where: { email } });
    }

    async create(userDto: CreateUserDto): Promise<UserDto>
    {
        const userInDb = await this.userRepo.findOne({ where: { email: userDto.email, enabled: true } });
        if (userInDb)
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        
        let item = <UserEntity>{ ...userDto };
        item.id = uuidv4();
        item.screen_name = userDto.screen_name;
        item.email = userDto.email;
        item.password = userDto.password;
        item.app_id = "0e5aea12-c3a9-4a0a-a80c-54343148d4cd";
        item.createdAt = new Date();
        item.updatedAt = new Date();
        item.enabled = true;
                
        const user: UserEntity = this.userRepo.create(item);

        await this.userRepo.save(user);

        return toUserDto(user);
    }
}