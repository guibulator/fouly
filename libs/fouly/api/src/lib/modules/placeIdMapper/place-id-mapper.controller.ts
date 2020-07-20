import { Controller, Post, Query } from '@nestjs/common';
import { PlaceIdMapperService } from './place-id-mapper.service';

@Controller('placeIdMapper')
export class PlaceIdMapperController {
  constructor(private placeIdMapperService: PlaceIdMapperService) {}

  @Post()
  async findOrCreateIdFromPlaceId(@Query('id') id, @Query('placeId') placeId) {
    return this.placeIdMapperService.findIdAndUpdateFromPlaceId(placeId, id);
  }
}
