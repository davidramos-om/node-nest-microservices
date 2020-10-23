
//https://github.com/typestack/class-validator#validation-decorators

import
{
    MinLength, MaxLength, IsString, Length, IsInt, IsEnum, IsPositive, ArrayNotEmpty,
    ArrayMinSize, ArrayMaxSize, IsUUID, IsNotEmpty
} from 'class-validator';
import { POST_TYPE } from 'src/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto
{
    @ApiProperty({ example: 'Protecting Our Planet Starts with You', description: 'Short title for your great post' })
    @Length(10, 50)
    @IsString()
    readonly title: string;

    @ApiProperty({ example: 'Protecting our planet starts with you. Here are just a few of the things you can do.', description: 'Full post body' })
    @MinLength(10)
    @MaxLength(2000)
    @IsString()
    readonly body: string;

    @ApiProperty({ example: 'IMAGE, VIDEO, LINK, TEXT', description: 'Post type' })
    @IsEnum(POST_TYPE)
    readonly postType: POST_TYPE;

    @ApiProperty({ example: 'saveearth, gogreen, savewater, ecofriendly', description: 'Kind of hashtags' })
    @ArrayNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(5)
    @MinLength(3, { each: true, message: "Tag is too short. Minimal length is 3 characters" })
    @MaxLength(15, { each: true, message: "Tag is too long. Maximal length is 15 characters" })
    tags: string[];

    @ApiProperty({ example: '?', description: 'Parent group id of community' })
    @IsUUID(4)
    readonly group_id: string;


    @ApiProperty({ example: '?', description: 'Authorize Application Identifier' })
    @IsUUID(4)
    @IsNotEmpty()
    readonly app_id: string;

    @ApiProperty({ example: '?', description: 'Authorize user Identifier' })
    @IsUUID(4)
    @IsNotEmpty()
    readonly user_id: string;

    readonly metaData: MetaData;
}
export class MetaData
{
    @ApiProperty({ example: '2000', description: 'File size' })
    @IsInt()
    @IsPositive()
    readonly size: number;

    @ApiProperty({ example: '.jpg', description: 'File extension' })
    @MinLength(3)
    @MinLength(4)
    @IsString()
    @IsNotEmpty({ message: "You must select a valid file." })
    readonly ext: string;

    @ApiProperty({ example: '/usr/user/docs/planet.jpg', description: 'File path' })
    @MinLength(10)
    @MaxLength(500)
    readonly filename: string;
}