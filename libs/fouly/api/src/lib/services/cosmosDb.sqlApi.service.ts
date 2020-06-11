import { Container, CosmosClient, Database } from '@azure/cosmos';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CosmosDbSqlApiService {
  private client: CosmosClient;
  private database: Database;
  private container: Container;
  private partitionKey: any;
  private url: string;
  private key: string;
  private dbName: string;
  private colName: string;

  constructor() {}

  init(url: string, key: string, dbName: string, colName: string, partitionKey: any) {
    this.url = url;
    this.key = key;
    this.dbName = dbName;
    this.colName = colName;
    this.partitionKey = partitionKey;

    this.client = new CosmosClient({ endpoint: this.url, key: this.key });
  }

  async ensureDb() {
    await this.client.databases.createIfNotExists({
      id: this.dbName
    });

    await this.client
      .database(this.dbName)
      .containers.createIfNotExists(
        { id: this.colName, partitionKey: this.partitionKey },
        { offerThroughput: 400 }
      );
  }

  async getObjects(query: any): Promise<any[]> {
    await this.ensureDb();
    this.database = this.client.database(this.dbName);
    this.container = this.database.container(this.colName);

    const { resources: items } = await this.container.items.query(query).fetchAll();
    return items;
  }

  async createObject(obj: any): Promise<any> {
    return await this.container.items.create(obj);
  }
}
