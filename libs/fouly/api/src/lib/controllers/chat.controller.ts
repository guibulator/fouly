import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessageCommand } from '@skare/fouly/data';
import { ChatService } from '../services/chat.service';

@Controller('chat')
export class ChatController {
  private signalRurl = 'FOULY_SIGNALR_URL';
  private chatHubUrl = 'FOULY_CHATHUB_URL';
  constructor(private chatService: ChatService, private configService: ConfigService) {}

  @Get('history/:placeId')
  async getMsgHistory(@Param() params) {
    return this.chatService.getMsgHistory(params.placeId);
  }

  @Post('postNewMsg')
  async postNewMsg(@Body() msgToSave: ChatMessageCommand) {
    // const signalRurl = this.configService.get<string>(this.chatHubUrl);

    const signalRurl = `https://skaresendgridapi.azurewebsites.net/api/chat`;
    return this.chatService.postNewMsg(msgToSave, signalRurl);
  }

  @Get('signalR/infoConnection')
  async getSignalRConnection() {
    // const signalRurl = this.configService.get<string>(this.signalRurl);
    const signalRurl =
      'https://skaresendgridapi.azurewebsites.net/api/getSignalrConnection?code=ef4Ob9BY2cvt6thdx4L5nE1lHppzSjU1OEsJTA3tMd3qVKp8Mtf1nQ==';
    return this.chatService.getSignalRconnection(signalRurl);
  }
}
