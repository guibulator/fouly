import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FavoriteCommand, FavoriteResult } from '@skare/fouly/data';
import { Model } from 'mongoose';
import { PlaceDetailsService } from '../../services/placeDetails.service';
import { PlaceIdMapperService } from '../placeIdMapper/place-id-mapper.service';
import { Favorite } from './favorite.schema';
@Injectable()
export class FavoriteService {
  constructor(
    private placeIdMapperervice: PlaceIdMapperService,
    private placeDetailsService: PlaceDetailsService,
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>
  ) {}
  async getFavorites(userId: string): FavoriteResult {
    const favs = await this.favoriteModel.find({ userId: userId }).exec();
    // TODO: The favorite model in bd has only 2 fields (userId and placeId)
    // Get the place details with contribution to return all the information the fav needs
    // TODO Front-End. For the My-Places route, get the storeCrowd and display it
    // placeId: string;
    // storeCrowdResult?: StoreCrowdResult;
    // userId?: string;
    // name?: string;
    // address?: string;
    // lat?: number;
    // lng?: number;
  }

  async add(cmd: FavoriteCommand) {
    //TODO: Changer la logique pour le internal placeId, on le crée une fois au query du commerce placeDetails. On retourne dans placeDetailsResult le foulyPlaceId et on travaille avec ça seulement. Ca va éviter de toujours faire le check pour chaque création
    const foulyPlaceId = await this.placeIdMapperervice.findIdAndUpdateFromPlaceId(cmd.placeId);
    const favorite = new this.favoriteModel({ ...cmd, foulyPlaceId });
    await favorite.save();
  }

  /**
   * Take all favorites from
   * @param localUserId
   * @param newUserId
   */
  async syncFromLocalUser(localUserId: string, newUserId: string) {
    // take all the favorites from localuser and copy them with the new userid
    const favorites = await this.favoriteModel.find({ userId: localUserId }).exec();
    favorites.forEach(async (fav) => {
      fav.userId = newUserId;
      await this.add(fav);
    });
  }

  async deleteFavorite(placeId: string, userId: string) {
    return await this.favoriteModel.deleteOne({ placeId, userId }).exec();
  }
}
