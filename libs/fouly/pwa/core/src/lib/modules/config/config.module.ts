import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConfigService } from './config.service';
import { Configuration } from './configuration';

@NgModule({
  imports: [],
  exports: [],
  providers: []
})
export class ConfigModule {
  static forRoot(config: Configuration): ModuleWithProviders {
    return {
      ngModule: ConfigModule,
      providers: [{ provide: ConfigService, useValue: config }]
    };
  }
}
