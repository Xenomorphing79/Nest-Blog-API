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
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserIsAuthorGuard } from '../guards/author.guard';
import { blogEntry } from '../models/blogEntry.interface';
import { BlogService } from '../service/blog.service';

export const blogEntriesUrl = 'http://localhost:3000/blog-entries';

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
}
