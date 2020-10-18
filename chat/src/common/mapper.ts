
import { PostEntity } from "src/post/entity/post.entity";
import { PostDto } from "src/post/dto/post-dto";
import { UserDto } from "src/user/dto/user.dto";
import { UserEntity } from "src/user/entity/user.entity";


export const toUserDto = (data: UserEntity): UserDto =>
{
    const { id, screen_name, email } = data;
  
    let userDto: UserDto = {
        id,
        screen_name,
        email,
    };
  
    return userDto;
};

export const toPostDto = (data: PostEntity): PostDto =>
{   
    let p = <PostDto><any>{ ...data };

    if (data.mediaMeta)
    {
        const json = JSON.parse(data.mediaMeta);
        p.metaData.ext = json.ext || '';
        p.metaData.filename = json.filename || '';
        p.metaData.size = json.size || 0;
    }
    
    return p;
}

