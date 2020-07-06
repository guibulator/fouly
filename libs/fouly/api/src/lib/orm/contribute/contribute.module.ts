import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceIdMapperModule } from '../placeIdMapper/place-id-mapper.module';
import { ContributeController } from './contribute.controller';
import { ConributeSchema, Contribute } from './contribute.schema';
import { ContributeService } from './contribute.service';

@Module({
  imports: [
    PlaceIdMapperModule,
    MongooseModule.forFeature([{ name: Contribute.name, schema: ConributeSchema }])
  ],
  providers: [ContributeService, Logger],
  controllers: [ContributeController],
  exports: [ContributeService]
})
export class ContributeModule {}
