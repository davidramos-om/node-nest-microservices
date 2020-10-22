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
import { CheckPermissionMT3 } from 'src/dto/check-permission-mt3.dto';

@Injectable()
export class AuthService
{
  constructor(
   
    @Inject(config.micro.users.name)
    private readonly client: ClientProxy,
   
    private readonly jwtService: JwtService) { }

    getHello(): string {
      return 'Hello World! I am the Auth MicroService';
    }
  
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

  async CheckPermissionMT3(dto: CheckPermissionMT3): Promise<boolean>   
  {
    // const user_id = dto.user_id;
    // const req_permission = dto.req_permission;
    // const full_path = dto.full_path;
    // const group_id = dto.group_id;
    // const app_id = dto.app_id;

    // let public_permissions = [201, 202, 203, 101, 102, 111, 122, 501, 506, 508, 701, 706, 708, 901, 906, 908, 911, 912, 920, 921, 922, 923, 1101];

    // if (public_permissions.includes(req_permission))
    // {
    //   return true;
    // }

    // let role = await Instance.UserPermission.Select({ user_id: user_id, type_id: [app_id, ...full_path, group_id] });
    // let app_role = role.filter(x => x.type_id == app_id);

    // if (app_role.length < 1)
    // {
    //   return false;
    // }

    // let permissions = await Instance.PermissionRole.Select({ id: app_role[0].role_id });

    // if (permissions.length < 1)
    // {
    //   return false;
    // }

    // let ids = [];
    // if (permissions[0].role_level < 3)
    // {
    //   return true;
    // }
    // else if (req_permission > 2000)
    // {
    //   ids = [app_id, ...full_path, group_id];
    // }
    // else
    // {
    //   switch (permissions[0].role_level)
    //   {
    //     case 3:
    //       ids = [app_id, ...full_path, group_id];
    //       break;
    //     case 4:
    //       if ([502, 702, 902, 1102].includes(req_permission))
    //         ids = [...full_path, group_id];
    //       else
    //         ids = [...full_path];
    //       break;
    //     case 5:
    //       ids = [group_id];
    //       break;

    //     default:
    //       return false;
    //   }
    // }

    // role = role.filter(x => ids.includes(x.type_id));

    // switch (role.length)
    // {
    //   case 0: return false;
    //   case 1: role = role[0].role_id; break

    //   default:
    //     let temp = [];

    //     for (let i = 0; i < role.length; i++)
    //     {
    //       temp.push(...role[i].role_id);
    //     }
    //     role = temp;
    // }

    // permissions = await Instance.PermissionRole.Select({ id: role });

    // switch (permissions.length)
    // {
    //   case 0: return false;
    //   case 1: permissions = permissions[0].privileges; break;

    //   default:
    //     let temp = [];

    //     for (let i = 0; i < permissions.length; i++)
    //     {
    //       temp.push(...permissions[i].privileges);
    //     }
    //     permissions = temp;
    // }

    // if (permissions.includes(req_permission))
    //   return true;
    return false;
  }
}