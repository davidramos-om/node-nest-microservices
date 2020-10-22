import { Controller, Post, Logger, UsePipes, ValidationPipe, Body, HttpException, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginUserDto } from '../dto/user-login.dto';
import { CheckPermissionMT3 } from 'src/dto/check-permission-mt3.dto';

@Controller('auth')
export class AuthController
{
  constructor(
    private readonly authService: AuthService) { }
 
  @Get()
  getHello(): string
  {
    return this.authService.getHello();
  }
  
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() dto: LoginUserDto)
  {
    return this.authService.login(dto);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async loggedIn(data)
  {
    try
    {
      Logger.log('loggedIn  : Auth Guard');

      if (!data || !data.jwt)
        throw new HttpException('Token must be provided', HttpStatus.UNAUTHORIZED);
      
      const res = this.authService.validateToken(data.jwt);
      
      return res;
    } catch (e)
    {
      Logger.log(e);
      return false;
    }
  }

  @MessagePattern({ role: 'permission', cmd: 'check', app: 'mt3' })
  @UsePipes(ValidationPipe)
  async checkPermissionMT3(dto: CheckPermissionMT3)  
  {
    try
    {
      
      const res = this.authService.CheckPermissionMT3(dto);
      return res;
    } catch (e)
    {
      Logger.log(e);
      return false;
    }
  }


  @MessagePattern({ role: 'auth', cmd: 'whoami' })
  async whoami(data)
  {
    if (!data || !data.jwt)
      throw new HttpException('Token must be provided', HttpStatus.UNAUTHORIZED);
    
    return this.authService.decodeToken(data.jwt);
  }
}