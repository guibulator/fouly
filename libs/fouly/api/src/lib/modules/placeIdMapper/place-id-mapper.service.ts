import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GooglePlaceIdService } from './google-place-id.service';
import { PlaceIdMapper } from './place-id-mapper.schema';

@Injectable()
export class PlaceIdMapperService {
  constructor(
    @InjectModel(PlaceIdMapper.name) private readonly placeIdMapperModel: Model<PlaceIdMapper>,
    private logger: Logger,
    private placeIdService: GooglePlaceIdService
  ) {}

  /**
   * Given a placeId that might change overtime, returns the associated internal id if it exists.
   * Note.
   * @param placeId
   * @param internalPlaceId If not specified, a new id might be created if no matching a currentId from placeId. It is important
   * to provide this value if there is an already existing entity that maps to a placeId.
   */
  async findIdAndUpdateFromPlaceId(placeId: string, internalPlaceId?: string): Promise<string> {
    // If not already mapped, try to find an entry with the placeId
    let internalId = internalPlaceId;

    if (!internalId) {
      const existing = await this.placeIdMapperModel.findOne({ placeId: placeId }).exec();
      if (existing) {
        this.logger.verbose(`Found a placeIdMapper entry with placeId ${placeId}`);
        internalId = existing._id.toHexString();
      }
    }

    const refreshedPlaceId = await this.placeIdService.getFreshPlaceId(placeId);
    if (refreshedPlaceId !== placeId || !internalId) {
      await this.placeIdMapperModel.findOneAndUpdate(
        { placeId: placeId },
        { placeId: refreshedPlaceId, $push: { oldPlaceIds: placeId } },
        { upsert: true }
      );
      this.logger.verbose(`Updated placeId ${placeId} with new ${refreshedPlaceId}`);
    }

    // If placeId was not already defined, return the _id property of the new
    // entry
    if (!internalId) {
      const existing = await this.placeIdMapperModel.findOne({ placeId: refreshedPlaceId }).exec();
      return existing._id.toHexString();
    }

    return internalId;
  }

  /**
   * Given a fouly place id, returns the most recent validated google placeId
   * @param foulyPlaceId
   */
  async getPlaceId(foulyPlaceId: string) {
    return await this.placeIdMapperModel.findOne({ _id: foulyPlaceId }).exec();
  }
}
