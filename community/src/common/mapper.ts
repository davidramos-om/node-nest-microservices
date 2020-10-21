
import { PostEntity } from "src/post/entity/post.entity";
import { PostDto } from "src/post/dto/post-dto";
// import { postData } from "src/post/interface/metaData.interface";

export const toPostDto = (data: PostEntity): PostDto =>
{   
    let p = <PostDto><any>{ ...data };
    return p;
}

