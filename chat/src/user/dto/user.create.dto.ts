import { IsNotEmpty, IsEmail, MinLength, Length, MaxLength } from 'class-validator';

export class CreateUserDto
{
    @IsNotEmpty()
    @Length(5, 20)
    screen_name: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(25)
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}