import { Context } from '@azure/functions';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AzureLoggerModule } from './azureLogger';
import { ChatController } from './controllers/chat.controller';
import { FoulyApiController } from './controllers/fouly-api.controller';
import { GeoLocationController } from './controllers/geo-location.controller';
import { MailController } from './controllers/mail.controller';
import { PlaceDetailsController } from './controllers/place-details.controller';
import { UserController } from './controllers/user.controller';
import { AllExceptionsFilter } from './filters/exception.filter';
import { ChatService } from './services/chat.service';
import { CityDetailService } from './services/cityDetail.service';
import { CosmosDbMongoApiService } from './services/cosmosDb.mongoApi.service';
import { CosmosDbSqlApiService } from './services/cosmosDb.sqlApi.service';
import { MailService } from './services/mail.service';
import { PlaceDetailsService } from './services/placeDetails.service';
import { StoreCrowdService } from './services/storeCrowd.service';
import { UserService } from './services/user.service';
import { WeatherService } from './services/weather.service';

@Module({})
export class FoulyApiModule {
  static forRoot(azureContextAccessor: () => Context): DynamicModule {
    return {
      module: FoulyApiModule,
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
        }),
        AzureLoggerModule.forRoot(azureContextAccessor)
      ],
      providers: [
        PlaceDetailsService,
        ChatService,
        CosmosDbSqlApiService,
        CosmosDbMongoApiService,
        UserService,
        MailService,
        StoreCrowdService,
        WeatherService,
        CityDetailService,
        { provide: APP_FILTER, useClass: AllExceptionsFilter }
      ]
    };
  }
}
