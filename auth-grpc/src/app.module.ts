import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HeroController } from './hero/hero.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, HeroController],
  providers: [AppService],
})
export class AppModule {}
