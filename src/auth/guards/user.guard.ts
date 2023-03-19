import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const user: User = request.user.user
    const params = request.params;
    return this.userService.findOne(user.id).pipe(
      map((user: User) => {
        let hasPermission = false;
        if(user.id === Number(params.id)) {
          hasPermission = true;
        }
        return user && hasPermission;
      })
    );
  }
}
