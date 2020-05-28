import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './controllers/chat.controller';
import { FoulyApiController } from './controllers/fouly-api.controller';
import { MailController } from './controllers/mail.controller';
import { PlaceDetailsController } from './controllers/place-details.controller';
import { ChatService } from './services/chat.service';
import { CosmosDbService } from './services/cosmosDb.service';
import { MailService } from './services/mail.service';
import { PlaceDetailsService } from './services/placeDetails.service';
@Module({
  controllers: [FoulyApiController, PlaceDetailsController, ChatController, MailController],
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true
    })
  ],
  providers: [PlaceDetailsService, ChatService, CosmosDbService, MailService],
  exports: []
})
export class FoulyApiModule {}
