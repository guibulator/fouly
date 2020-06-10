import { Injectable } from '@nestjs/common';
import { UserCommand, UserResult } from '@skare/fouly/data';
import { MongoClient } from 'mongodb';

@Injectable()
export class UserService {
  private config: any = {
    endpoint:
      'mongodb://fouly-users-db:9fo94Ng8leM9P0I9UW3i8yVPKgepb0dfI2HMUjUjwui9Ug54v786rJxjUNXrHnn7kt1XANxW3m2I9KBZI9Tm3w%3D%3D@fouly-users-db.mongo.cosmos.azure.com:10255/?ssl=true&appName=@fouly-users-db@',
    databaseId: 'users',
    containerId: 'user',
    partitionKey: { kind: 'Hash', paths: ['/userId'] }
  };

  constructor() {}

  async getUser(userId: string): Promise<UserResult> {
    let userResult: UserResult;
    MongoClient.connect(this.config.endpoint, function(err: any, client: any) {
      const db = client.db(this.config.databaseId);
      const result = db
        .collection(this.config.containerId)
        .find({ userId: userId }, function(_err: any, results: any) {
          userResult = results[0];
        });
      client.close();
    });
    return userResult;
  }

  async createUpdateUser(user: UserCommand): Promise<UserResult> {
    let userResult: UserResult;
    MongoClient.connect(this.config.endpoint, function(err: any, client: any) {
      const db = client.db('users');
      db.collection('user').updateOne(
        {
          email: user.email
        },
        {
          $set: {
            providerId: user.providerId,
            name: user.name,
            firstName: user.firstName,
            email: user.email,
            picture: user.picture,
            loginFrom: user.loginFrom
          }
        },
        { upsert: true },
        function(_err: any, result: any) {
          userResult = result;
          console.dir(_err);
          client.close();
        }
      );
    });
    return userResult;
  }

  async updateUser(user: UserCommand): Promise<UserResult> {
    return await this.addOrUpdateOne(user);
  }

  async addOrUpdateOne(user: UserCommand): Promise<UserResult> {
    const client = await MongoClient.connect(this.config.endpoint, { useNewUrlParser: true }).catch(
      (err) => {
        console.log(err);
      }
    );

    if (!client) {
      return;
    }

    try {
      const db = client.db('users');
      const collection: any = db.collection('user');
      const res: any = await collection.updateOne(
        {
          email: user.email
        },
        {
          $set: {
            providerId: user.providerId,
            name: user.name,
            firstName: user.firstName,
            email: user.email,
            picture: user.picture,
            loginFrom: user.loginFrom
          }
        },
        { upsert: true }
      );

      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
    } finally {
      client.close();
    }
  }

  async deleteUser(userId: string) {
    MongoClient.connect(this.config.endpoint, function(err: any, client: any) {
      const db = client.db(this.config.databaseId);
      db.collection(this.config.containerId).delete({ userId: userId });
      client.close();
    });
  }
}
