import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Request,
  Res,
} from '@nestjs/common';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserRole } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { UserGuard } from 'src/auth/guards/user.guard';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }

  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('userName') userName: string,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    if (userName === null || userName === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/user',
      });
    }
    return this.userService.paginateUsername(
      {
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/api/users',
      },
      { userName },
    );
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<User> {
    return this.userService.deleteOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(
    @Param('id') id: string,
    @Body() user: User,
  ): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
    const user: User = req.user;
    return this.userService
      .updateOne(user.id, { profileImage: file.filename })
      .pipe(
        map((user: User) => ({
          profileImage: user.profileImage,
        })),
      );
  }

  @Get('profile-image/:imagename')
  findProfileImage(
    @Param('imagename') imagename,
    @Res() res,
  ): Observable<Object> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/profileImages/' + imagename)),
    );
  }
}
