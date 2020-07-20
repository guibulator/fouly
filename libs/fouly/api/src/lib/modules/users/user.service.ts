import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCommand, UserResult } from '@skare/fouly/data';
import { Model } from 'mongoose';
import { User } from './user.schema';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  getUser(query: { userId?: string; email?: string }): Promise<UserResult> {
    return this.userModel.findOne(query).exec();
  }

  async createUpdateUser(user: UserCommand): Promise<UserResult> {
    const query = {
      userId: user.userId
    };
    const upsert: Partial<User> = {
      provider: user.provider,
      userId: user.userId,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      photoUrl: user.photoUrl,
      lang: user.lang
    };

    const userCreated = await this.userModel
      .findOneAndUpdate(query, upsert, { upsert: true, rawResult: true })
      .exec();

    if (userCreated.ok) {
      return userCreated.value;
    }

    const users = await this.userModel.find(query).exec();
    return users[0];
  }

  deleteUser(userId: string) {
    // TODO: Functionality not supported for now. Delete would be more of an update
    // where a deactivation date is set.
  }
}
