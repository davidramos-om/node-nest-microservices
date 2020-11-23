import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { AuthService } from 'src/proto/auth.interface';

import config from '../config';

export class AuthGuard_MsgPattern implements CanActivate
{
    constructor(

        @Inject(config.micro.auth.name)
        private readonly client: ClientProxy

    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean>
    {
        Logger.log('Connect to Message Pattern Auth microservice');

        const req = context.switchToHttp().getRequest();

        try
        {
            const res = await this.client.send(
                { role: 'auth', cmd: 'check' },
                { jwt: req.headers['authorization']?.split(' ')[1] })
                .pipe(timeout(5000))
                .toPromise<boolean>();

            Logger.log("canActivate : " + res);

            return res;
        } catch (err)
        {
            Logger.error(err);
            return false;
        }
    }
}

export class AuthGuard_GRPC implements CanActivate
{
    private authService: AuthService;
    constructor(@Inject(config.micro.auth.name) private client: ClientGrpc)
    {
        this.authService = this.client.getService<AuthService>(config.micro.auth.serviceName);
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean>
    {
        Logger.log('AuthGuard will connect to GRPC Auth microservice');

        const req = context.switchToHttp().getRequest();

        try
        {
            let jwt = '';
            jwt = req.headers['authorization'];

            if (!jwt)
                jwt = req.query.authorization;

            if (!jwt)
                return false;

            if (jwt.startsWith('Bearer'))
                jwt = jwt.split(' ')[1];

            return this.authService.isLoggedIn({ jwt })
                .toPromise()
                .then((result) =>
                {
                    return new Promise<any>((resolve, reject) =>
                    {
                        if (result.loggedIn)
                            resolve(true);
                        else
                            reject(false);
                    });

                }).catch(() =>
                {
                    return new Promise<any>((reject) =>
                    {
                        reject(false);
                    });
                })
        } catch (err)
        {
            return false;
        }
    }
}