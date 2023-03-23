import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { map, Observable, of, tap } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserIsAuthorGuard } from '../guards/author.guard';
import { blogEntry } from '../models/blogEntry.interface';
import { BlogService } from '../service/blog.service';
import { v4 as uuidv4 } from 'uuid';
import { Image } from '../models/image.interface';
import { join } from 'path';

export const blogEntriesUrl = 'https://nest-blog-api-production.up.railway.app//blog-entries';

export const storage = {
  storage: diskStorage({
    destination: './uploads/blog-entry-images',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('blog-entries')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blogEntry: blogEntry, @Request() req): Observable<blogEntry> {
    const user = req.user;
    return this.blogService.create(user, blogEntry);
  }

  // @Get()
  // findBlogEntries(@Query('userId') userId: number): Observable<blogEntry[]> {
  //   if (userId == null) {
  //     return this.blogService.findAll();
  //   }
  //   return this.blogService.findByUser(userId);
  // }

  @Get('')
  index(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    limit = limit > 100 ? 100 : limit;
    return this.blogService.paginateAll({
      limit: Number(limit),
      page: Number(page),
      route: blogEntriesUrl,
    });
  }

  @Get('user/:user')
  indexByUser(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Param('user') userId: number,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.blogService.paginateByUser(
      {
        limit: Number(limit),
        page: Number(page),
        route: blogEntriesUrl,
      },
      Number(userId),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<blogEntry> {
    return this.blogService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Put(':id')
  updateOne(
    @Param('id') id: number,
    @Body() blogEntry: blogEntry,
  ): Observable<blogEntry> {
    return this.blogService.updateOne(Number(id), blogEntry);
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: number): Observable<any> {
    return this.blogService.deleteOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Image> {
    return of({
      file,
    });
  }

  @Get('image/:imagename')
  findImage(
    @Param('imagename') imagename,
    @Res() res,
  ): Observable<Object> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/blog-entry-images/' + imagename)),
    );
  }
}
