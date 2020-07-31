import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessageCommand } from '@skare/fouly/data';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService, private configService: ConfigService) {}

  @Get('history/:foulyPlaceId')
  async getMsgHistory(@Param() params) {
    return this.chatService.getMsgHistory(params.foulyPlaceId);
  }

  @Post()
  async postNewMsg(@Body() msgToSave: ChatMessageCommand) {
    await this.chatService.postNewMsg(msgToSave);
    this.chatService.sendSignalRMessage(msgToSave); // do not wait this call
    return true;
  }

  @Get('signalR/infoConnection')
  async getSignalRConnection() {
    return this.chatService.getSignalRconnection();
  }
}
