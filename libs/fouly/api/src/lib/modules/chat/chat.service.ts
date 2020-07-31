import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessageCommand, ChatMessageResult } from '@skare/fouly/data';
import axios from 'axios';
import { Model } from 'mongoose';
import { PlaceIdMapperService } from '../placeIdMapper/place-id-mapper.service';
import { Chat } from './chat.schema';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private signalRChatUrl: string;
  private signalrConnectionInfoUrl: string;
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    private configService: ConfigService,
    private idMapper: PlaceIdMapperService
  ) {
    this.signalRChatUrl = configService.get<string>('FOULY-CHAT-SIGNALR-URL');
    this.signalrConnectionInfoUrl = configService.get<string>('FOULY-SIGNALR-CONNECTIONINFO-URL');
  }

  async getMsgHistory(placeId: string): Promise<ChatMessageResult[]> {
    const foulyPlaceId = await this.idMapper.findIdAndUpdateFromPlaceId(placeId);
    return await this.chatModel.find({ foulyPlaceId: foulyPlaceId }).exec();
  }

  async postNewMsg(cmd: ChatMessageCommand) {
    const data = Chat.fromCmd(cmd);
    const chat = new this.chatModel(data);
    await chat.save();
  }

  async sendSignalRMessage(newMsg: ChatMessageCommand) {
    try {
      const result = await axios.post(this.signalRChatUrl, newMsg);
      return result.data;
    } catch (err) {
      this.logger.error('There was an error calling axios.post', err);
      throw new BadRequestException();
    }
  }

  async getSignalRconnection() {
    try {
      const result = await axios.get(this.signalrConnectionInfoUrl);
      return result.data;
    } catch (err) {
      this.logger.error('There was an error calling axios.post', err);
      throw new BadRequestException();
    }
  }
}
