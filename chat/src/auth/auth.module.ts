import { Module } from '@nestjs/common';
import { UsersModule } from '../user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import config from '../../config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserEntity } from 'src/user/entity/user.entity';
// import { UsersService } from 'src/user/users.service';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt', property: 'user', session: true });

@Module({
  imports: [
    UsersModule,
    passportModule,    
    JwtModule.register({
      secret: config.SECRETKEY,
      signOptions: {
        expiresIn: config.EXPIRESIN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],  
  exports: [passportModule, JwtModule],
})
  
export class AuthModule {}