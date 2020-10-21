import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class LoginUserDto
{
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    @IsUUID(4)
    @IsNotEmpty()
    readonly app_id: string;
}