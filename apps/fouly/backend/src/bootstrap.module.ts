import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { FoulyApiModule } from '@skare/fouly/api';
@Module({})
export class BootstrapModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    return {
      module: BootstrapModule,
      imports: [FoulyApiModule, ConfigModule.forRoot(options)]
    };
  }
}
