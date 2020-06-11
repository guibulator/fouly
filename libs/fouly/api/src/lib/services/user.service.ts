import { Injectable } from '@nestjs/common';
import { UserCommand, UserResult } from '@skare/fouly/data';
import { CosmosDbMongoApiService } from './cosmosDb.mongoApi.service';
@Injectable()
export class UserService {
  private config: any = {
    endpoint:
      'mongodb://fouly-users-db:9fo94Ng8leM9P0I9UW3i8yVPKgepb0dfI2HMUjUjwui9Ug54v786rJxjUNXrHnn7kt1XANxW3m2I9KBZI9Tm3w%3D%3D@fouly-users-db.mongo.cosmos.azure.com:10255/?ssl=true&appName=@fouly-users-db@',
    databaseId: 'users',
    containerId: 'user',
    partitionKey: { kind: 'Hash', paths: ['/userId'] }
  };

  constructor(private dbService: CosmosDbMongoApiService) {
    this.dbService.init(this.config.endpoint, this.config.databaseId, this.config.containerId);
  }

  async getUser(userId: string): Promise<UserResult> {
    const query = {
      userId: userId
    };
    const res = await this.dbService.getObjects(query);
    return res[0];
  }

  async createUpdateUser(user: UserCommand): Promise<UserResult> {
    const query = {
      email: user.email
    };
    const upsert = {
      providerId: user.providerId,
      name: user.name,
      firstName: user.firstName,
      email: user.email,
      picture: user.picture,
      loginFrom: user.loginFrom
    };
    await this.dbService.createUpdateObject(query, upsert);
    const res = await this.dbService.getObjects(query);
    return res[0];
  }

  async deleteUser(userId: string) {
    const query = {
      userId: userId
    };
    return await this.dbService.deleteObjects(query);
  }
}
