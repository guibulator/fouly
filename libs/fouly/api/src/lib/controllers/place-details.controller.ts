/// <reference types="googlemaps" />
import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaceDetailsService } from '../services/placeDetails.service';

@Controller('place-details')
export class PlaceDetailsController {
  constructor(
    private placeDetailsService: PlaceDetailsService,
    private configService: ConfigService
  ) {}

  @Get('fouly-place-id/:foulyPlaceId')
  async getPlaceDetails(
    @Param() params,
    @Query('sessionToken') sessionToken: string,
    @Query('asOfTime') asOfTime: string,
    @Headers('user-lang') language: string
  ) {
    //Storer les model chercher par des user dans fouly.  Stats importante.
    // Idées. Pour tout ce qui est statistiques provenant de l'app web, utiliser les custom events de google. C'est gratuit et pratique.
    //Combien de fois le status est vue par un user.
    //On utilise le model souvent ?
    return this.placeDetailsService.getPlaceDetails(
      params.foulyPlaceId,
      sessionToken,
      new Date(asOfTime),
      language
    );
  }

  @Get('find')
  async findPlaceFromQuery(
    @Query('query') query,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('sessionToken') sessionToken: string,
    @Query('languageCode') languageCode: string
  ) {
    return this.placeDetailsService.findPlace({ query, sessionToken, lat, lng, languageCode });
  }
  /**
   * * Make sure that the key is protected by CORS in google api console..
   * Note. When using google place photo api, it is easier to call the api client side.
   * Google will return an optimized image with headers that offer caching. So technically, evey photo will only
   * hit google once(per user). An optimization would be to cache the image once in our database and serve it with caching.
   * We can also have a dedicated key for the place-details API. right now we are using only 1 api key.
   */
  @Get('key/place-photo')
  async getImageApiKey() {
    return { key: this.configService.get<string>('FOULY-GOOGLEMAPS-API-KEY') };
  }
}
