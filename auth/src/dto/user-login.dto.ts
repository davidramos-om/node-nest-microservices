import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto
{
    @ApiProperty({ example: 'email@domain.com', description: 'Email address' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: '**********', description: 'A challenge password' })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ example: '?', description: 'Authorize Application Identifier' })
    @IsUUID(4)
    @IsNotEmpty()
    readonly app_id: string;
}