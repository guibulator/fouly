import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCommand, UserResult } from '@skare/fouly/data';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import { User } from './user.schema';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}
  getUser(query: { userId?: string; email?: string }): Promise<UserResult> {
    return this.userModel.find(query).exec()[0];
  }

  async createUpdateUser(user: UserCommand): Promise<UserResult> {
    if (!user.email) {
      user.email = uuid();
    }
    if (!user.userId) {
      user.userId = uuid();
    }

    const query = {
      email: user.email
    };
    const upsert = {
      providerId: user.providerId,
      userId: user.userId,
      name: user.name,
      firstName: user.firstName,
      email: user.email,
      picture: user.picture,
      loginFrom: user.loginFrom
    };

    const userCreated = await this.userModel
      .findOneAndUpdate(query, upsert, { upsert: true })
      .exec();

    if (userCreated) {
      return userCreated;
    }

    const users = await this.userModel.find(query).exec();
    return users[0];
  }

  deleteUser(userId: string) {
    const query = {
      userId: userId
    };
    return this.userModel.deleteOne(query).exec();
  }
}
