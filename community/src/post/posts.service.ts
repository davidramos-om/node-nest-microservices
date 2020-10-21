import { Injectable } from '@nestjs/common';
import { PostDto } from 'src/post/dto/post-dto';
import { CreatePostDto } from './dto/create-post-dto';
import { v4 as uuidv4 } from 'uuid';

import {  InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { Repository } from 'typeorm';
import { toPostDto } from 'src/common/mapper';


@Injectable()
export class PostsService
{
    // private readonly posts: post[] = [];

    // create(p: CreatePostDto, user: UserDto): post    
    // {
    //     let item = <post>{ ...p };
        
    //     item.id = uuidv4();
    //     item.approval = false;
    //     item.banned = false;
    //     item.created_at = new Date();
    //     item.updated_at = new Date();
    //     item.originalPoster = user.id;
        
    //     this.posts.push(item);

    //     return item;
    // }
    
    // findAll(): post[]
    // {
    //     return this.posts;
    // }

    // findOne(id : string): post
    // {
    //     return this.posts.find(p => p.id === id);
    // }
    
    // delete(item: post) : boolean
    // {
    //     const index = this.posts.indexOf(item);
    //     if (index < 0)
    //         return false;
        
    //     this.posts.splice(index, 1);
    //     return true;
    // }

    // findBy(keyword: string): post[]
    // {
    //     const key = keyword.toLocaleLowerCase();

    //     const filter = this.posts.filter(p => p.title.toLocaleLowerCase().includes(key) ||
    //         p.body.toLocaleLowerCase().includes(key)
    //     );
         
    //     return filter;
    // }
 
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>,
    ) { }
    

    async create(p: CreatePostDto): Promise<PostDto>    
    {
        let item = this.postRepo.create();
        
        item.id = uuidv4();
        item.commentEnabled = true;
        item.deleted = false;
        item.mediaMeta = JSON.stringify(p.metaData);
        item.tags = p.tags;
        item.title = p.title;
        item.body = p.body;        
        item.approved = true;
        item.banned = false;
        item.created_at = new Date();
        item.updated_at = new Date();
        item.originalPoster = p.user_id;

        item.group_id = p.group_id;
        item.app_id = p.app_id;
        
        await this.postRepo.save(item);

        return toPostDto(item);
    }
    
    async findAll(): Promise<PostEntity[]>
    {
        const result = await this.postRepo.find({ banned: false, approved: true, deleted: false });
        return result;
    }

    async findOne(id : string): Promise<PostDto>
    {
        const result = await this.postRepo.findOne({ id: id, banned: false, approved: true, deleted: false });
        
        if (!result)
            return null;

        return toPostDto(result);
    }
    
    async delete(id: string): Promise<void>
    {
        await this.postRepo.delete({ id: id });
    }

    async findBy(keyword: string): Promise<PostEntity[]>
    {        
        const key = (keyword || '').toLocaleLowerCase();

        // let items: PostDto[] = [];

        const q = this.postRepo
            .createQueryBuilder("p")
            .where("lower(p.title) like :title", { title: '%' + key + '%' })
            .orWhere("lower(p.body) like :body", { body: '%' + key + '%' });

        // console.info("query", q.getQueryAndParameters());
        const result = await q.getMany(); 

        // if (result)
        // {
        //     items = result.map((p) =>
        //     {
        //         return toPostDto(p);
        //     });
        // }
        
        return result;
    }
}
