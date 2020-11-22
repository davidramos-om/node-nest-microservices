import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserDto
{
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    screen_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    createdAt?: Date;
}