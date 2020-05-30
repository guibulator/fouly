import { CosmosClient } from '@azure/cosmos';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CosmosDbService {
  constructor() {}

  async ensureDb(client: CosmosClient, databaseId: string, containerId: string, partitionKey: any) {
    await client.databases.createIfNotExists({
      id: databaseId
    });

    await client
      .database(databaseId)
      .containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });
  }

  createGuid(): string {
    return uuidv4();
  }
}
