import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import slugify from 'slugify';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { blogEntryEntity } from '../models/blogEntry.entity';
import { blogEntry } from '../models/blogEntry.interface';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(blogEntryEntity)
    private readonly blogRepository: Repository<blogEntryEntity>,
    private userService: UserService,
  ) {}
  create(user: User, blogEntry: blogEntry): Observable<blogEntry> {
    blogEntry.author = user;
    return this.generateSlug(blogEntry.title).pipe(
      switchMap((slug: string) => {
        blogEntry.slug = slug;
        return from(this.blogRepository.save(blogEntry));
      }),
    );
  }

  findAll(): Observable<blogEntry[]> {
    return from(
      this.blogRepository.find({
        relations: ['author'],
      }),
    );
  }

  findOne(id: number): Observable<blogEntry> {
    return from(
      this.blogRepository.findOne({
        where: {
          id: id,
        },
        relations: ['author'],
      }),
    );
  }

  findByUser(userId: number): Observable<blogEntry[]> {
    return from(
      this.blogRepository.find({
        where: {
          author: {
            id: userId,
          },
        },
        relations: ['author'],
      }),
    ).pipe(map((blogEntries: blogEntry[]) => blogEntries));
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }
}
