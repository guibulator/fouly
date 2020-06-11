import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './controllers/chat.controller';
import { FoulyApiController } from './controllers/fouly-api.controller';
import { GeoLocationController } from './controllers/geo-location.controller';
import { MailController } from './controllers/mail.controller';
import { PlaceDetailsController } from './controllers/place-details.controller';
import { UserController } from './controllers/user.controller';
import { ChatService } from './services/chat.service';
import { CosmosDbMongoApiService } from './services/cosmosDb.mongoApi.service';
import { CosmosDbSqlApiService } from './services/cosmosDb.sqlApi.service';
import { MailService } from './services/mail.service';
import { PlaceDetailsService } from './services/placeDetails.service';
import { UserService } from './services/user.service';
@Module({
  controllers: [
    FoulyApiController,
    PlaceDetailsController,
    ChatController,
    UserController,
    MailController,
    GeoLocationController
  ],
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true
    })
  ],
  providers: [
    PlaceDetailsService,
    ChatService,
    MailService,
    UserService,
    CosmosDbSqlApiService,
    CosmosDbMongoApiService
  ],
  exports: []
})
export class FoulyApiModule {}
