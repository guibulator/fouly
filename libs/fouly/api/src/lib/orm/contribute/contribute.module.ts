import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContributeController } from './contribute.controller';
import { ConributeSchema, Contribute } from './contribute.schema';
import { ContributeService } from './contribute.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Contribute.name, schema: ConributeSchema }])],
  providers: [ContributeService, Logger],
  controllers: [ContributeController]
})
export class ContributeModule {}
