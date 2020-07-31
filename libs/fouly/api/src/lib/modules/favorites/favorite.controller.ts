/// <reference types="node" />
import { Body, Controller, Delete, Get, Headers, Param, Post, Query, Req } from '@nestjs/common';
import { FavoriteCommand } from '@skare/fouly/data';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get()
  async get(
    @Headers('user-id') userId: string,
    @Headers('user-lang') userLang: string,
    @Req() req
  ) {
    return await this.favoriteService.getFavorites(userId, userLang);
  }

  @Post()
  async addFavorite(@Body() cmd: FavoriteCommand) {
    return await this.favoriteService.add(cmd).then(() => true);
  }

  @Post('sync')
  async syncFromLocalUser(@Query() query, @Headers('user-id') newUserId: string) {
    return await this.favoriteService.syncFromLocalUser(query.localUserId, newUserId);
  }

  @Delete(':foulyPlaceId')
  async deleteFavorite(@Param() params, @Headers('user-id') userId: string) {
    return await this.favoriteService.deleteFavorite(params.foulyPlaceId, userId).then(() => true);
  }
}
