import { Container, CosmosClient, Database } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { Msg } from '@skare/fouly/pwa/core';
import { CosmosDbService } from './cosmosDb.service';
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  private config: any = {
    endpoint: 'https://fouly-chat-db.documents.azure.com:443/',
    key: '3R1032AAzCRwmXxfqsYwsuIFT6C8OxlB5QH1d2IsgjB9sIlobPxbejCHrRWAA6BI0pinNRbx9nxpoRNCr9jCMQ==',
    databaseId: 'fouly-chat-db',
    containerId: 'docs',
    partitionKey: { kind: 'Hash', paths: ['/id'] }
  };

  constructor(private cosmosDbService: CosmosDbService) {
    this.client = new CosmosClient({ endpoint: this.config.endpoint, key: this.config.key });
    this.database = this.client.database(this.config.databaseId);
    this.container = this.database.container(this.config.containerId);
  }

  private async ensureDbContext() {
    await this.cosmosDbService.ensureDb(
      this.client,
      this.config.databaseId,
      this.config.containerId,
      this.config.partitionKey
    );
  }

  async getMsgHistory(placeId: string): Promise<Msg[]> {
    await this.ensureDbContext();

    const querySpec = {
      query: `SELECT {"msg":c.msg, "author":c.author, "time":c.time, "placeId":c.placeId} FROM c where c.placeId = "${placeId}"`
    };

    const { resources: items } = await this.container.items.query(querySpec).fetchAll();

    const result = items.map((x) => {
      const msg = new Msg();
      msg.text = x['$1'].msg;
      msg.author = x['$1'].author;
      msg.time = x['$1'].time;
      msg.placeId = x['$1'].placeId;
      return msg;
    });

    return result;
  }

  async saveNewMsg(msg: Msg) {
    const newItem = {
      id: this.cosmosDbService.createGuid(),
      msg: msg.text,
      author: msg.author,
      time: msg.time,
      placeId: msg.placeId
    };
    await this.container.items.create(newItem);
  }
}
