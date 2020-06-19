import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributeEntity } from './contribute/contribute.entity';
/**
 * This module should be only imported once at root.
 * see https://dev.to/azure/how-to-add-a-free-mongodb-database-to-your-nestjs-api-with-typeorm-2fop for example with connection string
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get(
          'FOULY-NOSQL-COMMON-CONNECTION-STRING'
        ) /** Use either url alone or configuration with host, port, username & password*/,
        host: configService.get('FOULY-NOSQL-COMMON-HOST'),
        port: +configService.get<number>('FOULY-NOSQL-COMMON-PORT'),
        username: configService.get('FOULY-NOSQL-COMMON-USERNAME'),
        password: configService.get('FOULY-NOSQL-COMMON-PASSWORD'),
        database: configService.get('FOULY-NOSQL-COMMON-DATABASE'),
        entities: [ContributeEntity],
        synchronize: true
      }),
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}
