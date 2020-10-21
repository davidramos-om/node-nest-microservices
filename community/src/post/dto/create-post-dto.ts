
//https://github.com/typestack/class-validator#validation-decorators

import
    {
        MinLength, MaxLength, IsString, Length, IsInt, IsEnum, IsPositive, ArrayNotEmpty,
        ArrayMinSize, ArrayMaxSize, IsUUID, IsNotEmpty
    } from 'class-validator';
import { POST_TYPE } from 'src/common/enums';


export class CreatePostDto
{
    @Length(10, 50)
    @IsString()
    readonly title: string;
    
    @MinLength(10)
    @MaxLength(2000)
    @IsString()
    readonly body: string;

    @IsEnum(POST_TYPE)
    readonly postType: POST_TYPE;

    @ArrayNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(5)
    @MinLength(3, { each: true, message: "Tag is too short. Minimal length is 3 characters" })
    @MaxLength(15, { each: true, message: "Tag is too long. Maximal length is 15 characters" })
    tags: string[];

    @IsUUID(4)
    readonly group_id: string;


    @IsUUID(4)
    @IsNotEmpty()
    readonly app_id: string;

    @IsUUID(4)
    @IsNotEmpty()
    readonly user_id: string;

    readonly metaData: MetaData;    
}
class MetaData
{
    @IsInt()
    @IsPositive()
    readonly size: number;
    
    @MinLength(3)
    @MinLength(4)
    @IsString()
    @IsNotEmpty({ message: "You must select a valid file." })
    readonly ext: string;

    @MinLength(10)
    @MaxLength(500)    
    readonly filename: string;
}