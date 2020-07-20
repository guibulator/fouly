import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FavoriteCommand, FavoriteResult } from '@skare/fouly/data';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import { PlaceDetailsService } from '../../services/placeDetails.service';
import { PlaceIdMapperService } from '../placeIdMapper/place-id-mapper.service';
import { UserService } from '../users/user.service';
import { Favorite } from './favorite.schema';

@Injectable()
export class FavoriteService {
  constructor(
    private placeIdMapperervice: PlaceIdMapperService,
    private placeDetailsService: PlaceDetailsService,
    private userService: UserService,
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>
  ) {}
  async getFavorites(userId: string): Promise<FavoriteResult[]> {
    //const user = this.userService.getUser({ userId: userId }); //pour aller chercher la langue de user si elle est stocker dans User. sinon dans les preferences???

    const favs = await this.favoriteModel.find({ userId: userId }).exec();

    if (!Array.isArray(favs)) return null;

    const favResults: FavoriteResult[] = [];

    for (let favIndex = 0; favIndex < favs.length; favIndex++) {
      if (favs[favIndex].placeId) {
        const result = await this.placeDetailsService.getPlaceDetails(
          favs[favIndex].placeId,
          uuid(),
          new Date(),
          null //fournir la langue du user
        );

        //TODO MAPPER
        if (result) {
          favResults.push({
            placeId: result.place_id,
            address: result.adr_address,
            lat: result.geometry?.location.lat,
            lng: result.geometry?.location.lng,
            name: result.name,
            userId: userId
          });
        }
      }
    }

    return favResults;
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
