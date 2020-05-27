import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Msg } from '@skare/fouly/pwa/core';
import { ChatService } from '../services/chat.service';
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':placeId')
  async getMsgHistory(@Param() params) {
    return this.chatService.getMsgHistory(params.placeId);
  }

  @Post()
  async saveNewMsg(@Body() msgToSave: Msg) {
    return this.chatService.saveNewMsg(msgToSave);
  }
}
