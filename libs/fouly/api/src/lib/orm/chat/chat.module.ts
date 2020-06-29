import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { Chat, ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])],
  providers: [ChatService, Logger],
  controllers: [ChatController]
})
export class ChatModule {}
