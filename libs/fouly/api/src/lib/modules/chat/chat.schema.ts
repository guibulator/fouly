import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChatMessageCommand } from '@skare/fouly/data';
import { Document } from 'mongoose';

@Schema()
export class Chat extends Document {
  @Prop()
  placeId: string;
  @Prop()
  msg: string;
  @Prop()
  author: string;
  @Prop()
  time: Date;
  @Prop()
  userId: string;

  static fromCmd(cmd: ChatMessageCommand) {
    return {
      placeId: cmd.placeId,
      msg: cmd.msg,
      author: cmd.author,
      time: cmd.time,
      userId: cmd.userId
    };
  }
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
