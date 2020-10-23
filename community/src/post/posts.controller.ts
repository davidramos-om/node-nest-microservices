import
{
    Body, Controller, Delete, Get, Header, HttpCode, Param, ParseUUIDPipe,
    Post, Query, Redirect, Req, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';

import { CreatePostDto } from './dto/create-post-dto';
import { PostDto } from './dto/post-dto';
import { PostsService } from './posts.service';

import { NotItemFound, ParamRequired } from '../common/exceptions';
import { PostEntity } from './entity/post.entity';
import { AuthGuard } from '../guards/AuthGuard';


@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController
{
    constructor(private postsService: PostsService) { }

    @Get()
    getHello(): string
    {
        return this.postsService.getHello();
    }


    @Get('all')
    async findAll(): Promise<PostEntity[]>
    {
        return this.postsService.findAll();
    }

    @Get(':id')
    async findOne(@Param() params): Promise<PostDto>        
    {
        if (!params.id)
            throw new ParamRequired('find post')

        let item = this.postsService.findOne(params.id);

        return item;
    }

    @Get('/findBy/:keyword')
    async findBy(@Param('keyword') keyword): Promise<PostEntity[]>
    {
        if (!keyword)
            return this.postsService.findAll();
        // return res.send(this.postsService.findAll());

        // return res.send(this.postsService.findBy(keyword));
        return this.postsService.findBy(keyword);
    }

    @Get('docs')//posts/docs?app=develapp
    @Redirect('https://mydevelapp.com/in-app-tutorials/', 302)
    getDocs(@Query('app') app)
    {
        if (app) ////Override any arguments passed to the @Redirect()
        {
            if (app === 'fca')
                return { url: 'https://mydevelapp.com/app-fca/' };

            if (app === 'isd')
                return { url: 'https://mydevelapp.com/app-isdconnect/' };

            if (app === 'isd')
                return { url: 'https://mydevelapp.com/app-develapp/' };
        }
    }

    @Post()
    @HttpCode(201)
    @UsePipes(ValidationPipe)
    @Header('Cache-Control', 'none')
    async create(@Body() dto: CreatePostDto, @Req() req: any): Promise<PostDto>
    {
        const post = this.postsService.create(dto);
        return post;
    }

    @Delete(':id')
    // remove(@Param('id') id: string)
    // @Roles('admin', 'moderator') 
    remove(@Param('id', new ParseUUIDPipe()) id: string)
    {
        if (!id)
            throw new ParamRequired('delete post');

        let item = this.postsService.findOne(id);
        if (!item)
            throw new NotItemFound(id, 'post');

        return this.postsService.delete(id);
    }
}
