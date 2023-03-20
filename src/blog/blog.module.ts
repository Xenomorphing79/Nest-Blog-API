import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { blogEntryEntity } from './models/blogEntry.entity';
import { BlogController } from './controller/blog.controller';
import { BlogService } from './service/blog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([blogEntryEntity]),
    AuthModule,
    UserModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
