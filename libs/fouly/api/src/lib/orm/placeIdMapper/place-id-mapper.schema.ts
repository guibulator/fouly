import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * _id is our internal id
 */
@Schema()
export class PlaceIdMapper extends Document {
  @Prop()
  placeId: string;
}

export const PlaceIdMapperSchema = SchemaFactory.createForClass(PlaceIdMapper);
