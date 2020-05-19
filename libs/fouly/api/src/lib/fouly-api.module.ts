import { Module } from '@nestjs/common';

import { FoulyApiController } from './fouly-api.controller';

@Module({
  controllers: [FoulyApiController],
  providers: [],
  exports: []
})
export class FoulyApiModule {}
