import { Context } from '@azure/functions';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AzureLoggerModule } from './azureLogger';
import { FoulyApiController } from './controllers/fouly-api.controller';
import { GeoLocationController } from './controllers/geo-location.controller';
import { MailController } from './controllers/mail.controller';
import { PlaceDetailsController } from './controllers/place-details.controller';
import { AllExceptionsFilter } from './filters/exception.filter';
import { DatabaseModule } from './orm/database-common.module';
import { MailService } from './services/mail.service';
import { PlaceDetailsService } from './services/placeDetails.service';
import { CityDetailService } from './services/rapid-api/cityDetail.service';
import { WeatherService } from './services/rapid-api/weather.service';
import { StoreCrowdService } from './services/storeCrowd.service';

@Module({})
export class FoulyApiModule {
  static forRoot(azureContextAccessor: () => Context): DynamicModule {
    return {
      module: FoulyApiModule,
      controllers: [
        FoulyApiController,
        PlaceDetailsController,
        MailController,
        GeoLocationController
      ],
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true
        }),
        AzureLoggerModule.forRoot(azureContextAccessor),
        DatabaseModule
      ],
      providers: [
        PlaceDetailsService,

        MailService,
        StoreCrowdService,
        WeatherService,
        CityDetailService,
        { provide: APP_FILTER, useClass: AllExceptionsFilter }
      ]
    };
  }
}
