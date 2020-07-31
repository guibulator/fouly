import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * _id is our internal id
 * placeId is google placeId that can change overtime
 */
@Schema()
export class PlaceIdMapper extends Document {
  @Prop()
  placeId: string;

  @Prop()
  oldPlaceIds: string[];
}

export const PlaceIdMapperSchema = SchemaFactory.createForClass(PlaceIdMapper);
