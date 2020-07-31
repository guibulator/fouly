import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FavoriteCommand, FavoriteResult } from '@skare/fouly/data';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import { PlaceDetailsService } from '../../services/placeDetails.service';
import { PlaceIdMapperService } from '../placeIdMapper/place-id-mapper.service';
import { Favorite } from './favorite.schema';

@Injectable()
export class FavoriteService {
  constructor(
    private placeDetailsService: PlaceDetailsService,
    private placeIdMapperService: PlaceIdMapperService,
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>
  ) {}
  async getFavorites(userId: string, userLang: string): Promise<FavoriteResult[]> {
    const favs = await this.favoriteModel.find({ userId: userId }).exec();

    if (!Array.isArray(favs)) return null;

    const favResults: FavoriteResult[] = [];

    for (let favIndex = 0; favIndex < favs.length; favIndex++) {
      if (favs[favIndex].foulyPlaceId) {
        const placeIdMap = await this.placeIdMapperService.getPlaceId(favs[favIndex].foulyPlaceId);
        const result = await this.placeDetailsService.getPlaceDetails(
          placeIdMap.placeId,
          uuid(),
          new Date(),
          userLang //fournir la langue du user
        );

        //TODO MAPPER
        if (result) {
          favResults.push({
            foulyPlaceId: result.foulyPlaceId,
            placeId: result.place_id,
            address: result.shortAddress,
            lat: result.geometry?.location.lat,
            lng: result.geometry?.location.lng,
            name: result.name,
            userId: userId,
            storeCrowdResult: result.storeCrowdResult
          });
        }
      }
    }

    return favResults;
  }

  async add(cmd: FavoriteCommand) {
    const favorite = new this.favoriteModel({ ...cmd });
    await favorite.save();
  }

  /**
   * Take all favorites from
   * @param localUserId
   * @param newUserId
   */
  async syncFromLocalUser(localUserId: string, newUserId: string) {
    // take all the favorites from localuser and copy them with the new userid
    // if already sync, do nothing
    const hasOneAtLeast = await this.favoriteModel.findOne({ userId: newUserId }).exec();
    if (hasOneAtLeast) {
      return true;
    }
    const favorites = await this.favoriteModel.find({ userId: localUserId }).exec();
    favorites.forEach(async (fav) => {
      await this.add({ foulyPlaceId: fav.foulyPlaceId, userId: newUserId });
    });
    return true;
  }

  async deleteFavorite(foulyPlaceId: string, userId: string) {
    return await this.favoriteModel.deleteOne({ foulyPlaceId, userId }).exec();
  }
}
