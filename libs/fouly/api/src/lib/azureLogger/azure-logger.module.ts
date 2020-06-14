import { DynamicModule, Module } from '@nestjs/common';
import { Logger } from './azure-logger';
@Module({})
export class AzureLoggerModule {
  static forRoot(azureContextAccessor): DynamicModule {
    return {
      module: AzureLoggerModule,
      imports: [],
      exports: [Logger],
      providers: [{ provide: 'AZURECONTEXT', useValue: azureContextAccessor ?? console }, Logger]
    };
  }
}
