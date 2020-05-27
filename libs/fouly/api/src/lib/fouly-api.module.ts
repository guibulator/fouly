import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { FoulyApiController } from './controllers/fouly-api.controller';
import { PlaceDetailsController } from './controllers/place-details.controller';
import { ChatService } from './services/chat.service';
import { CosmosDbService } from './services/cosmosDb.service';
import { PlaceDetailsService } from './services/placeDetails.service';
@Module({
  controllers: [FoulyApiController, PlaceDetailsController, ChatController],
  imports: [],
  providers: [PlaceDetailsService, ChatService, CosmosDbService],
  exports: []
})
export class FoulyApiModule {}
