import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessageCommand } from '@skare/fouly/data';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService, private configService: ConfigService) {}

  @Get('history/:placeId')
  async getMsgHistory(@Param() params) {
    return this.chatService.getMsgHistory(params.placeId);
  }

  @Post()
  async postNewMsg(@Body() msgToSave: ChatMessageCommand) {
    await this.chatService.postNewMsg(msgToSave);
    this.chatService.sendSignalRMessage(msgToSave); // do not wait this call
  }

  @Get('signalR/infoConnection')
  async getSignalRConnection() {
    return this.chatService.getSignalRconnection();
  }
}
