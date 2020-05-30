/// <reference types="googlemaps" />
import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlaceDetailsService } from '../services/placeDetails.service';
@Controller('place-details')
export class PlaceDetailsController {
  constructor(private placeDetailsService: PlaceDetailsService) {}

  @Get('info/:placeId')
  async getPlaceDetails(@Param() params, @Query('sessionToken') sessionToken) {
    return this.placeDetailsService.getPlaceDetails(params.placeId, sessionToken);
  }

  @Get('find')
  async findPlaceFromQuery(
    @Query('query') query,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('sessionToken') sessionToken: string
  ) {
    return this.placeDetailsService.findPlace({ query, sessionToken, lat, lng });
  }
}
