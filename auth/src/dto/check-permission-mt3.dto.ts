import { IsArray, IsInt, IsNotEmpty, IsPositive, IsUUID, Min } from 'class-validator';

export class CheckPermissionMT3
{
    @IsUUID(4)
    @IsNotEmpty()
    readonly user_id: string;
 
    @IsInt()
    @IsPositive()
    @Min(1)
    readonly req_permission: number;

    @IsUUID(4)
    @IsNotEmpty()
    readonly app_id: string;

    @IsArray()
    readonly full_path: string;
    
    @IsUUID(4)
    @IsNotEmpty()
    group_id : string
}