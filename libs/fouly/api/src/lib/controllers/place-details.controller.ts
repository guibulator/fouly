import { Controller, Get, Param } from '@nestjs/common';
import { PlaceDetailsService } from '../services/placeDetails.service';
@Controller('place-details')
export class PlaceDetailsController {
  constructor(private placeDetailsService: PlaceDetailsService) {}

  @Get(':placeId')
  async getPlaceDetails(@Param() params) {
    return this.placeDetailsService.getPlaceDetails(params.placeId);
  }
}
