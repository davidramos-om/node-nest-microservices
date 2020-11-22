import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { RegistrationStatus } from './dto/regisration-status.interface';
import { CreateUserDto } from './dto/user.create.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService
{
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    findOne(query: FindConditions<UserEntity>): Promise<UserEntity>
    {
        return this.userRepository.findOne(query);
    }


    findOneByEmail(email: string): Promise<UserEntity>
    {
        return this.userRepository.findOne({ email: email, enabled: true })
    }

    async createUser(userDto: CreateUserDto): Promise<RegistrationStatus>
    {
        try
        {
            const userInDb = await this.userRepository.findOne({ where: { email: userDto.email, enabled: true } });
            if (userInDb)
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

            let item = this.userRepository.create();
            item.id = uuidv4();
            item.screen_name = userDto.screen_name;
            item.email = userDto.email;
            item.password = userDto.password;
            item.app_id = userDto.app_id;
            item.createdAt = new Date();
            item.updatedAt = new Date();
            item.enabled = true;

            const user: UserEntity = this.userRepository.create(item);

            await this.userRepository.save(user);

            const status: RegistrationStatus = {
                success: false,
                message: 'user registered'
            };

            return status;

        } catch (err)
        {
            const status: RegistrationStatus = {
                success: false,
                message: err
            };

            return status;
        }
    }
    // async getLoguedUserInfo(token: string)
    // {
    //     if (!token)
    //         throw new HttpException('Token must be provided', HttpStatus.UNAUTHORIZED);

    //     const user = await this.client.send({ role: 'auth', cmd: 'whoami' }, { jwt: token })
    //         .pipe(
    //             timeout(5000),
    //             catchError(err =>
    //             {
    //                 if (err instanceof TimeoutError)
    //                 {
    //                     return throwError(new RequestTimeoutException());
    //                 }
    //                 return throwError(err);
    //             }))
    //         .toPromise();

    //     return user;
    // }
}
