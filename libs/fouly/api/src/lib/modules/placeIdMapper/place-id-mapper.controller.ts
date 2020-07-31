import { Controller, Post, Query } from '@nestjs/common';
import { PlaceIdMapperService } from './place-id-mapper.service';

@Controller('place-id-mapper')
export class PlaceIdMapperController {
  constructor(private placeIdMapperService: PlaceIdMapperService) {}

  @Post()
  async findOrCreateIdFromPlaceId(@Query('id') id, @Query('place-id') placeId) {
    const foulyPlaceId = await this.placeIdMapperService.findIdAndUpdateFromPlaceId(placeId, id);
    return { foulyPlaceId };
  }
}
