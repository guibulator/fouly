import { Logger, Module } from '@nestjs/common';
import { ContributeModule } from '../modules/contribute/contribute.module';
import { PlaceIdMapperModule } from '../modules/placeIdMapper/place-id-mapper.module';
import { FoulyCrowdModelService } from './crowdStatus/foulyCrowdModel.service';
import { QuoteFromFeedbackService } from './crowdStatus/quoteFromFeedback.service';
import { StoreCrowdService } from './crowdStatus/storeCrowd.service';
import { QuoteFromElectronicStoreService } from './crowdStatus/storeTypes/quoteFromElectronicStore.service';
import { QuoteFromFurnitureStoreService } from './crowdStatus/storeTypes/quoteFromFurnitureStore.service';
import { QuoteFromHardwareStoreService } from './crowdStatus/storeTypes/quoteFromHardwareStore.service';
import { QuoteFromLiquorStoreService } from './crowdStatus/storeTypes/quoteFromLiquorStore.service';
import { QuoteFromPharmacyService } from './crowdStatus/storeTypes/quoteFromPharmacy.service';
import { QuoteFromRetailService } from './crowdStatus/storeTypes/quoteFromRetail.service';
import { QuoteFromSupermarketService } from './crowdStatus/storeTypes/quoteFromSupermarket.service';
import { MailService } from './mail.service';
import { PlaceDetailsService } from './placeDetails.service';
import { CityDetailService } from './rapid-api/cityDetail.service';
import { WeatherService } from './rapid-api/weather.service';

@Module({
  imports: [ContributeModule, PlaceIdMapperModule],
  exports: [
    MailService,
    PlaceDetailsService,
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
    QuoteFromHardwareStoreService,
    QuoteFromFurnitureStoreService
  ],
  providers: [
    Logger,
    MailService,
    PlaceDetailsService,
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
    QuoteFromHardwareStoreService,
    QuoteFromFurnitureStoreService
  ]
})
export class SharedModule {}
