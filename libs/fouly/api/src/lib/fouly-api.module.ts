import { Module } from '@nestjs/common';
import { FoulyApiController } from './controllers/fouly-api.controller';
import { PlaceDetailsController } from './controllers/place-details.controller';
import { PlaceDetailsService } from './services/placeDetails.service';

@Module({
  controllers: [FoulyApiController, PlaceDetailsController],
  imports: [],
  providers: [PlaceDetailsService],
  exports: []
})
export class FoulyApiModule {}
