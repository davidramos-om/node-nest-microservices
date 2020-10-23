import { Module } from '@nestjs/common';
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-fastify-rate-limiter';
import { APP_INTERCEPTOR } from '@nestjs/core';


import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule,
    RateLimiterModule.register({
      points: 100,
      duration: 60,
      type: 'Memory',
      errorMessage: 'Too many requests, please try again later.',
      keyPrefix: 'global',
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    }
  ],
})
export class AppModule { }
