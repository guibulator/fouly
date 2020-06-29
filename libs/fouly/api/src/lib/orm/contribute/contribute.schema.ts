import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ContributeCommand } from '@skare/fouly/data';
import { Document } from 'mongoose';

@Schema()
export class Contribute extends Document {
  @Prop()
  placeId: string;

  @Prop()
  storeType: string;

  @Prop()
  speed: string;

  @Prop()
  queueLength: string;

  @Prop()
  userId: string;

  @Prop()
  lat?: number;

  @Prop()
  lng?: number;

  @Prop()
  time: Date;

  static fromCmd(cmd: ContributeCommand) {
    return {
      placeId: cmd.placeId,
      queueLength: cmd.queueLength,
      speed: cmd.speed,
      userId: cmd.userId,
      lat: cmd.lat,
      lng: cmd.lng,
      time: cmd.time
    };
  }
}

export const ConributeSchema = SchemaFactory.createForClass(Contribute);
