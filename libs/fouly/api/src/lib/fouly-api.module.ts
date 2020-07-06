import { Context } from '@azure/functions';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AzureLoggerModule } from './azureLogger';
import { FoulyApiController } from './controllers/fouly-api.controller';
import { GeoLocationController } from './controllers/geo-location.controller';
import { MailController } from './controllers/mail.controller';
import { PlaceDetailsController } from './controllers/place-details.controller';
import { AllExceptionsFilter } from './filters/exception.filter';
import { DatabaseModule } from './orm/database-common.module';
import { SharedModule } from './services/shared.module';
@Module({})
export class FoulyApiModule {
  static forRoot(azureContextAccessor: () => Context): DynamicModule {
    return {
      module: FoulyApiModule,
      controllers: [
        FoulyApiController,
        PlaceDetailsController,
        MailController,
        GeoLocationController
      ],
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true
        }),
        AzureLoggerModule.forRoot(azureContextAccessor),
        DatabaseModule,
        SharedModule
      ],
      providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }]
    };
  }
}
