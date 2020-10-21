import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
      const user = request.user;
      
      if (!user)
          throw new UnauthorizedException(null, 'You need to login to proceed');
      
    return matchRoles(roles, user?.roles);
  }
}

const matchRoles = (roles, userRoles) =>
{

    return true;
}