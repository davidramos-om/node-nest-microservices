import { Injectable } from '@nestjs/common';
import { post } from 'src/post/interface/post.interface';
import { CreatePostDto } from './dto/create-post-dto';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from 'src/user/dto/user.dto';


@Injectable()
export class PostService
{
    private readonly posts: post[] = [];

    create(p: CreatePostDto, user: UserDto): post    
    {
        let item = <post>{ ...p };
        
        item.id = uuidv4();
        item.approval = false;
        item.banned = false;
        item.created_at = new Date();
        item.updated_at = new Date();
        item.originalPoster = user.id;
        
        this.posts.push(item);

        return item;
    }
    
    findAll(): post[]
    {
        return this.posts;
    }

    findOne(id : string): post
    {
        return this.posts.find(p => p.id === id);
    }
    
    delete(item: post) : boolean
    {
        const index = this.posts.indexOf(item);
        if (index < 0)
            return false;
        
        this.posts.splice(index, 1);
        return true;
    }

    findBy(keyword: string): post[]
    {
        const key = keyword.toLocaleLowerCase();

        const filter = this.posts.filter(p => p.title.toLocaleLowerCase().includes(key) ||
            p.body.toLocaleLowerCase().includes(key)
        );
         
        return filter;
    }
}
