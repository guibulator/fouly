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
import { AllExceptionsFilter } from './filters/exception.filter';
import { ContributeModule } from './orm/contribute/contribute.module';
import { DatabaseModule } from './orm/database-common.module';
import { ChatService } from './services/chat.service';
import { CosmosDbSqlApiService } from './services/cosmosDb.sqlApi.service';
import { FoulyCrowdModelService } from './services/crowdStatus/foulyCrowdModel.service';
import { QuoteFromFeedbackService } from './services/crowdStatus/quoteFromFeedback.service';
import { StoreCrowdService } from './services/crowdStatus/storeCrowd.service';
import { QuoteFromElectronicStoreService } from './services/crowdStatus/storeTypes/quoteFromElectronicStore.service';
import { QuoteFromFurnitureStoreService } from './services/crowdStatus/storeTypes/quoteFromFurnitureStore.service';
import { QuoteFromHardwareStoreService } from './services/crowdStatus/storeTypes/quoteFromHardwareStore.service';
import { QuoteFromLiquorStoreService } from './services/crowdStatus/storeTypes/quoteFromLiquorStore.service';
import { QuoteFromPharmacyService } from './services/crowdStatus/storeTypes/quoteFromPharmacy.service';
import { QuoteFromRetailService } from './services/crowdStatus/storeTypes/quoteFromRetail.service';
import { QuoteFromSupermarketService } from './services/crowdStatus/storeTypes/quoteFromSupermarket.service';
import { MailService } from './services/mail.service';
import { PlaceDetailsService } from './services/placeDetails.service';
import { CityDetailService } from './services/rapid-api/cityDetail.service';
import { WeatherService } from './services/rapid-api/weather.service';
@Module({})
export class FoulyApiModule {
  static forRoot(azureContextAccessor: () => Context): DynamicModule {
    return {
      module: FoulyApiModule,
      controllers: [
        FoulyApiController,
        PlaceDetailsController,
        ChatController,
        MailController,
        GeoLocationController
      ],
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true
        }),
        AzureLoggerModule.forRoot(azureContextAccessor),
        DatabaseModule,
        ContributeModule
      ],
      providers: [
        PlaceDetailsService,
        ChatService,
        CosmosDbSqlApiService,
        MailService,
        StoreCrowdService,
        WeatherService,
        CityDetailService,
        QuoteFromFeedbackService,
        FoulyCrowdModelService,
        QuoteFromPharmacyService,
        QuoteFromRetailService,
        QuoteFromLiquorStoreService,
        QuoteFromHardwareStoreService,
        QuoteFromElectronicStoreService,
        QuoteFromSupermarketService,
        QuoteFromFurnitureStoreService,
        { provide: APP_FILTER, useClass: AllExceptionsFilter }
      ]
    };
  }
}
