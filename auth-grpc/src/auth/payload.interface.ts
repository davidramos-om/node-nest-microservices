export interface JwtPayload
{
    email: string;
    screen_name: string;
    id: string;
}

export interface AccessToken
{
    accessToken: any,
    expiresIn: string,
}