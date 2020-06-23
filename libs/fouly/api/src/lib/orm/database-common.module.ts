import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ContributeModule } from './contribute/contribute.module';
import { UserModule } from './users/user.module';
/**
 * This module should be only imported once at root.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule, ContributeModule, UserModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('FOULY-NOSQL-CONNECTION-STRING'),
        useNewUrlParser: true,
        useFindAndModify: false /* fixes deprecation warning */
      }),
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}
