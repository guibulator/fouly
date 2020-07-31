import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FavoriteCommand } from '@skare/fouly/data';
import { Document } from 'mongoose';

@Schema()
export class Favorite extends Document {
  @Prop()
  foulyPlaceId: string;

  @Prop()
  userId: string;

  static fromCmd(cmd: FavoriteCommand) {
    return cmd; // for now work with command like dto
  }
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
