import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { ContributeModule } from './contribute/contribute.module';
import { FavoriteModule } from './favorites/favorite.module';
import { PlaceIdMapperModule } from './placeIdMapper/place-id-mapper.module';
import { UserModule } from './users/user.module';
/**
 * This module should be only imported once at root.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule,
        PlaceIdMapperModule,
        ContributeModule,
        UserModule,
        ChatModule,
        FavoriteModule
      ],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('FOULY-NOSQL-CONNECTION-STRING'),
        useNewUrlParser: true,
        useFindAndModify: false /* fixes deprecation warning */,
        dbName: config.get<string>('FOULY-NOSQL-DB-NAME')
      }),
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}
