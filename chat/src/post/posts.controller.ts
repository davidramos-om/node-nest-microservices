import
{
    Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, ParseUUIDPipe,
    Post, Query, Redirect, Req, Res, SetMetadata, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';

import { CreatePostDto } from './dto/create-post-dto'; 
import { PostDto } from './dto/post-dto';
import { PostsService } from './posts.service';

import { NotItemFound, ParamRequired } from '../common/exceptions';
import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from 'src/auth/roles.decorator';

import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('posts')
@UseGuards(RolesGuard) // controller-scoped, method-scoped, or global-scoped
export class PostsController
{
    constructor(private postsService: PostsService) { }
    
    @Get()
    // @Roles('admin')
    async findAll(): Promise<PostDto[]>
    {
        return this.postsService.findAll();
    }

    @Get(':id')
    // @Roles('admin')
    async findOne(@Param() params): Promise<PostDto>        
    {
        if (!params.id)
        throw new ParamRequired('find post')

        let item = this.postsService.findOne(params.id);
       
        return item;
    }


    @Get('/findBy/:keyword') 
    // @Roles('admin')
    async findBy(@Param('keyword') keyword): Promise<PostDto[]>
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
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() dto: CreatePostDto, @Req() req: any): Promise<PostDto>
    {
        const user = <UserDto>req.user;
        const post = this.postsService.create(dto, user);        
        return post;
    }

    @Delete(':id')
    // remove(@Param('id') id: string)
    // @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id', new ParseUUIDPipe()) id: string)
    {
        if (!id)
            throw new ParamRequired('delete post');
        
        // let item = this.postsService.findOne(id);
        // if (!item)
        //     throw new NotItemFound(id, 'post');
                
        return this.postsService.delete(id);
    }
}
