import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserCommand } from '@skare/fouly/data';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  userId: string;

  @Prop()
  providerId: string;

  @Prop()
  name: string;

  @Prop()
  firstName: string;

  @Prop()
  email: string;

  @Prop()
  picture: string;

  @Prop()
  loginFrom: string;

  static fromCmd(cmd: UserCommand) {
    return cmd; // for now work with command like dto
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
