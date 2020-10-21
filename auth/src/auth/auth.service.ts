import { Injectable, Inject, Logger, RequestTimeoutException, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

import config from '../config';
import { LoginUserDto } from '../dto/user-login.dto';
import { LoginStatus } from '../dto/login-status.interface';
import { JwtPayload } from 'src/dto/payload.interface';
import { comparePasswords } from 'src/common/utils';

@Injectable()
export class AuthService
{
  constructor(
   
    @Inject(config.micro.users.name)
    private readonly client: ClientProxy,
   
    private readonly jwtService: JwtService) { }

  async validateUser(email: string, password: string, app_id: string): Promise<any>  
  {
    try
    {
      const user = await this.client.send({ role: 'user', cmd: 'get' }, { email, app_id })
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

      const areEqual = await comparePasswords(user?.password, password);

      if (areEqual)
        return user;
    
      return null;
    } catch (e)
    {
      Logger.log(e);
      throw e;
    }
  }

  async login(dto: LoginUserDto): Promise<LoginStatus>
  {
    
    const user = await this.validateUser(dto.email, dto.password, dto.app_id);
    
    if (!user)
      throw new HttpException('User not found or invalid credentials', HttpStatus.UNAUTHORIZED);

    if (!user.id || !user.email || !user.screen_name)
      throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
    
    // generate and sign token
    const token = this.createToken(user.id, user.email, user.screen_name);

    return {
      id: user.id,
      email: user.email,
      screen_name: user.screen_name,
      ...token,
    }
  }

  private createToken(id: string, email: string, screen_name: string): any
  {
      const expiresIn = config.EXPIRESIN;

      const user: JwtPayload = { email, screen_name, id };
      const accessToken = this.jwtService.sign(user);
      
      return {
          accessToken,
          expiresIn,
      };
  }

  validateToken(jwt: string)
  {
    const payload = this.jwtService.verify(jwt);
    return payload;
  }

  decodeToken(jwt: string)
  {
    return this.jwtService.decode(jwt);
  }
}