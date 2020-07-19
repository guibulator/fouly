/// <reference types="node" />
import { Body, Controller, Delete, Get, Headers, Param, Post, Query, Req } from '@nestjs/common';
import { FavoriteCommand } from '@skare/fouly/data';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get()
  async get(@Headers('user-id') userId: string, @Req() req) {
    console.log(req);
    return await this.favoriteService.getFavorites(userId);
  }

  @Post()
  async addFavorite(@Body() cmd: FavoriteCommand) {
    return await this.favoriteService.add(cmd);
  }

  @Post('sync')
  async syncFromLocalUser(@Query() query, @Headers('uuser-id') newUserId: string) {
    return await this.favoriteService.syncFromLocalUser(query.localUserId, newUserId);
  }

  @Delete(':placeId')
  async deleteFavorite(@Param() params, @Headers('user-id') userId: string) {
    return await this.favoriteService.deleteFavorite(params.placeId, userId);
  }
}
