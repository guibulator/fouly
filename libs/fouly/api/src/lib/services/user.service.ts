import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserCommand } from '@skare/fouly/data';
import { uuid } from 'uuidv4';
import { CosmosDbMongoApiService } from './cosmosDb.mongoApi.service';
@Injectable()
export class UserService {
  private apiKeyEnv = 'FOULY-USER-DB-KEY';
  private config: any = {
    databaseId: 'users',
    containerId: 'user',
    partitionKey: { kind: 'Hash', paths: ['/userId'] }
  };

  constructor(private dbService: CosmosDbMongoApiService, private configService: ConfigService) {
    const dbUrlEndpoint = `mongodb://fouly-users-db:${this.configService.get<string>(
      this.apiKeyEnv
    )}@fouly-users-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@fouly-users-db@`;

    this.dbService.init(dbUrlEndpoint, this.config.databaseId, this.config.containerId);
  }

  getUser(query: any, callback: any): void {
    this.dbService.getOneObject(query, callback);
  }

  createUpdateUser(user: UserCommand, callback: any): void {
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
    this.dbService.createUpdateObject(query, upsert);
    this.dbService.getOneObject(query, callback);
  }

  deleteUser(userId: string, callback: any) {
    const query = {
      userId: userId
    };
    this.dbService.deleteObjects(query, callback);
  }
}