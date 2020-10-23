import { IsNotEmpty, IsEmail, MinLength, Length, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto
{
    @ApiProperty({ example: 'name18', description: 'username  or nick name' })
    @IsNotEmpty()
    @Length(5, 20)
    screen_name: string;

    @ApiProperty({ example: '**********', description: 'A challenge password' })
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(25)
    password: string;

    @ApiProperty({ example: 'email@domain.com', description: 'Email' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '?', description: 'Authorize Application Identifier' })
    @IsUUID(4)
    @IsNotEmpty()
    readonly app_id: string;
}