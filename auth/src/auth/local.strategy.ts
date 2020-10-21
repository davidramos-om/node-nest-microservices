import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService)
  {
    super();
  }

  async validate(username: string, password: string, app_id: string): Promise<any>
  {
    console.info("LocalStrategy.validate", username, password, app_id);
    const user = await this.authService.validateUser(username, password, app_id);

    if (!user)
    {
      throw new UnauthorizedException();
    }

    return user;
  }
}