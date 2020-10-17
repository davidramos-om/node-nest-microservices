import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, Redirect, Req, Res, SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post-dto'; 
import { post } from './interface/post.interface';
import { PostService } from './post.service';

import { NotItemFound, ParamRequired } from '../common/exceptions';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('posts')
@UseGuards(RolesGuard) // controller-scoped, method-scoped, or global-scoped
export class PostController
{
    constructor(private postsService: PostService) { }
    
    @Get()
    // @Roles('admin')
    async findAll(): Promise<post[]>
    {
        return this.postsService.findAll();
    }

    @Get(':id')
    // @Roles('admin')
    async findOne(@Param() params): Promise<post>        
    {
        if (!params.id)
        throw new ParamRequired('find post')

        let item = this.postsService.findOne(params.id);
       
        return item;
    }


    @Get('/findBy/:keyword') 
    // @Roles('admin')
    async findBy(@Param('keyword') keyword): Promise<post[]>
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
    async create(@Body() dto: CreatePostDto, @Req() req: any): Promise<post>
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
        
        let item = this.postsService.findOne(id);
        if (!item)
            throw new NotItemFound(id, 'post');
        
        
        return this.postsService.delete(item);
    }
}
