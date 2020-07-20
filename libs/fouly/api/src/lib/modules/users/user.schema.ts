import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserCommand } from '@skare/fouly/data';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  userId: string;

  @Prop()
  provider: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  photoUrl: string;

  @Prop()
  lang: string;

  static fromCmd(cmd: UserCommand) {
    return cmd; // for now work with command like dto
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
