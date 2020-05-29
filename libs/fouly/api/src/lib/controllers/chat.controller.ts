import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatMessageCommand } from '@skare/fouly/data';
import { ChatService } from '../services/chat.service';
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':placeId')
  async getMsgHistory(@Param() params) {
    return this.chatService.getMsgHistory(params.placeId);
  }

  @Post()
  async saveNewMsg(@Body() msgToSave: ChatMessageCommand) {
    return this.chatService.saveNewMsg(msgToSave);
  }
}
