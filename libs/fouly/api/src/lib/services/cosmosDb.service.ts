import { CosmosClient } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CosmosDbService {
  private readonly logger = new Logger(CosmosDbService.name);

  constructor() {}

  async ensureDb(client: CosmosClient, databaseId: string, containerId: string, partitionKey: any) {
    const { database } = await client.databases.createIfNotExists({
      id: databaseId
    });
    console.log(`Created database:\n${database.id}\n`);

    const { container } = await client
      .database(databaseId)
      .containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });

    console.log(`Created container:\n${container.id}\n`);
  }

  private _p8(s: boolean = false) {
    const p = (Math.random().toString(16) + '000000000').substr(2, 8);
    return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
  }

  createGuid(): string {
    return this._p8() + this._p8(true) + this._p8(true) + this._p8();
  }
}
