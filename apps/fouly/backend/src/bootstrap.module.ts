import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { FoulyApiModule } from '@skare/fouly/api';
@Module({})
export class BootstrapModule {
  static forRoot(options?: ConfigModuleOptions, contextAccessor?: () => any): DynamicModule {
    if (!contextAccessor) {
      contextAccessor = localCtxLogger;
    }
    return {
      module: BootstrapModule,
      imports: [ConfigModule.forRoot(options), FoulyApiModule.forRoot(contextAccessor)]
    };
  }
}

function localCtxLogger() {
  return {
    log: {
      info: console.log,
      error: console.log,
      verbose: console.log,
      warn: console.log
    }
  };
}
