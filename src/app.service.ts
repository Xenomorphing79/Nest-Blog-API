import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is a backend project, please refer to github to know how to use it.';
  }
}
