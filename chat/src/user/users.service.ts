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
        const user = await this.userRepo.findOne({ where: { email } });

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
        const { screen_name, password, email } = userDto;

        const userInDb = await this.userRepo.findOne({ where: { screen_name } });
        if (userInDb)
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        
        const user: UserEntity = this.userRepo.create({
            screen_name,
            password,
            email,
        });

        await this.userRepo.save(user);

        return toUserDto(user);
    } 

    private _sanitizeUser(user: UserEntity) {
        delete user.password;
        return user;
      }
}