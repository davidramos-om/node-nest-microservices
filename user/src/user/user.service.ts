import { Injectable, Logger, RequestTimeoutException, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult, FindConditions } from 'typeorm';

import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

import { UserEntity } from './user.entity';
import config from 'src/config';


@Injectable()
export class UserService
{
    constructor(
       
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,


        @Inject(config.micro.auth.name)
        private readonly client: ClientProxy
        
    ) { }

    findOne(query: FindConditions<UserEntity>): Promise<UserEntity>
    {
        return this.userRepository.findOne(query);
    }

    findOneByEmail(email: string): Promise<UserEntity>
    {
        return this.userRepository.findOne({ email: email, enabled: true });
    }

    async getLoguedUserInfo(token: string)
    {
        if (!token)
            throw new HttpException('Token must be provided', HttpStatus.UNAUTHORIZED);

        const user = await this.client.send({ role: 'auth', cmd: 'whoami' }, { jwt: token })
            .pipe(
                timeout(5000),
                catchError(err =>
                {
                    if (err instanceof TimeoutError)
                    {
                        return throwError(new RequestTimeoutException());
                    }
                    return throwError(err);
                }))
            .toPromise();
        
        return user;
    }

    async createUser(user: any): Promise<InsertResult>
    {
        try
        {
            /**
             * Perform all needed checks
             */

            const userEntity = this.userRepository.create(user);

            const res = await this.userRepository.insert(userEntity);

            Logger.log('createUser - Created user');

            return res;
        } catch (e)
        {
            Logger.log(e);
            throw e;
        }
    }
}