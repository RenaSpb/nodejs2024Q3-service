import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Testing hot reload now!');
    return 'Hello World!';
  }
}
