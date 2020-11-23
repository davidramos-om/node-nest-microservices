import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from '../config';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor()
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.JWT_SECRETKEY,
        });
    }

    async validate(payload)
    {
        return { id: payload.sub, user: payload.user };
    }
}