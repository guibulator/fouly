import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GooglePlaceIdService } from './google-place-id.service';
import { PlaceIdMapperController } from './place-id-mapper.controller';
import { PlaceIdMapper, PlaceIdMapperSchema } from './place-id-mapper.schema';
import { PlaceIdMapperService } from './place-id-mapper.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: PlaceIdMapper.name, schema: PlaceIdMapperSchema }])],
  providers: [PlaceIdMapperService, GooglePlaceIdService, Logger],
  exports: [PlaceIdMapperService],
  controllers: [PlaceIdMapperController]
})
export class PlaceIdMapperModule {}
