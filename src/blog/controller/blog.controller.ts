import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { blogEntry } from '../models/blogEntry.interface';
import { BlogService } from '../service/blog.service';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blogEntry: blogEntry, @Request() req): Observable<blogEntry> {
    const user = req.user.user;
    return this.blogService.create(user, blogEntry);
  }

  @Get()
  findBlogEntries(@Query('userId') userId: number): Observable<blogEntry[]> {
    if (userId == null) {
      return this.blogService.findAll();
    }
    return this.blogService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<blogEntry> {
    return this.blogService.findOne(id);
  }
}
