import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('test')
export class FoulyApiController {
  constructor(private configurationService: ConfigService) {}
  @Get()
  getData() {
    console.log('api called');
    return `Working ${new Date()}`;
  }
}
