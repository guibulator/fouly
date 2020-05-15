import { Controller, Get } from '@nestjs/common';

@Controller('mail')
export class FoulyApiController {
  constructor() {}
  @Get('send')
  getData() {
    console.log('api called');
    return 'Mail sent';
  }
}
