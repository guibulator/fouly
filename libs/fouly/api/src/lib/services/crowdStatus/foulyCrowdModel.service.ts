import { Injectable } from '@nestjs/common';
import { QuoteFromElectronicStoreService } from './storeTypes/quoteFromElectronicStore.service';
import { QuoteFromFurnitureStoreService } from './storeTypes/quoteFromFurnitureStore.service';
import { QuoteFromHardwareStoreService } from './storeTypes/quoteFromHardwareStore.service';
import { QuoteFromLiquorStoreService } from './storeTypes/quoteFromLiquorStore.service';
import { QuoteFromPharmacyService } from './storeTypes/quoteFromPharmacy.service';
import { QuoteFromRetailService } from './storeTypes/quoteFromRetail.service';
import { QuoteFromSupermarketService } from './storeTypes/quoteFromSupermarket.service';

@Injectable()
export class FoulyCrowdModelService {
  constructor(
    private readonly quoteFromSupermarketService: QuoteFromSupermarketService,
    private readonly quoteFromPharmacyService: QuoteFromPharmacyService,
    private readonly quoteFromRetailService: QuoteFromRetailService,
    private readonly quoteFromLiquorStoreService: QuoteFromLiquorStoreService,
    private readonly quoteFromHardwareStoreService: QuoteFromHardwareStoreService,
    private readonly quoteFromFurnitureStoreService: QuoteFromFurnitureStoreService,
    private readonly quoteFromElectronicStoreService: QuoteFromElectronicStoreService
  ) {}

  getCrowdStatus(storeType: string, asOfTime: Date): string {
    switch (storeType) {
      case 'supermarket':
        return this.quoteFromSupermarketService.getCrowdStatus(asOfTime);
      case 'pharmacy':
        return this.quoteFromPharmacyService.getCrowdStatus(asOfTime);
      case 'retail':
        return this.quoteFromRetailService.getCrowdStatus(asOfTime);
      case 'liquor_store':
        return this.quoteFromLiquorStoreService.getCrowdStatus(asOfTime);
      case 'hardware_store':
        return this.quoteFromHardwareStoreService.getCrowdStatus(asOfTime);
      case 'electronic_store':
        return this.quoteFromElectronicStoreService.getCrowdStatus(asOfTime);
      case 'furniture_store':
        return this.quoteFromFurnitureStoreService.getCrowdStatus(asOfTime);
      case 'gas_station':
        return 'low';
      default:
        return null;
    }
  }
}
