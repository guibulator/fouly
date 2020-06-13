import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessageCommand, ChatMessageResult } from '@skare/fouly/data';
import axios from 'axios';
import { uuid } from 'uuidv4';
import { CosmosDbSqlApiService } from './cosmosDb.sqlApi.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private apiKeyEnv = 'FOULY-CHAT-DB-KEY';
  private config: any = {
    endpoint: 'https://fouly-chat-db.documents.azure.com:443/',
    databaseId: 'fouly-chat-db',
    containerId: 'docs',
    partitionKey: { kind: 'Hash', paths: ['/id'] }
  };

  constructor(private dbService: CosmosDbSqlApiService, private configService: ConfigService) {
    this.dbService.init(
      this.config.endpoint,
      this.configService.get<string>(this.apiKeyEnv),
      this.config.databaseId,
      this.config.containerId,
      this.config.partitionKey
    );
  }

  async getMsgHistory(placeId: string): Promise<ChatMessageResult[]> {
    const query = {
      query: `SELECT {"msg":c.msg, "author":c.author, "time":c.time, "placeId":c.placeId} FROM c where c.placeId = "${placeId}"`
    };

    const items = await this.dbService.getObjects(query);

    const result = items.map((x) => {
      const msg = new ChatMessageResult();
      msg.msg = x['$1'].msg;
      msg.author = x['$1'].author;
      msg.time = x['$1'].time;
      msg.placeId = x['$1'].placeId;
      return msg;
    });

    return result;
  }

  async postNewMsg(newMsg: ChatMessageCommand) {
    const msgToCreate = {
      id: uuid(),
      msg: newMsg.msg,
      author: newMsg.author,
      time: newMsg.time,
      placeId: newMsg.placeId
    };

    await this.dbService.createObject(msgToCreate);
  }

  async sendSignalRMessage(newMsg: ChatMessageCommand, signalRurl: string) {
    try {
      const result = await axios.post(signalRurl, newMsg);
      return result.data;
    } catch (err) {
      this.logger.error('There was an error calling axios.post', err);
      throw new BadRequestException();
    }
  }

  async getSignalRconnection(url: string) {
    try {
      const result = await axios.get(url);
      return result.data;
    } catch (err) {
      this.logger.error('There was an error calling axios.post', err);
      throw new BadRequestException();
    }
  }
}
