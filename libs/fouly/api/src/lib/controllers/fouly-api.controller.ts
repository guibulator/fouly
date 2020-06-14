import { Controller, Get } from '@nestjs/common';
import { Logger } from '../azureLogger';

@Controller('test')
export class FoulyApiController {
  constructor(private logger: Logger) {}
  @Get()
  getData() {
    this.logger.verbose('Test logger is working');
    return `Working ${new Date()}`;
  }
}
