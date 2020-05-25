import { Injectable } from '@angular/core';
import { Configuration } from './configuration';

/**
 * Will be provided during application boostraping using configModule.forRoot(configuration)
 */
@Injectable({ providedIn: 'root' })
export class ConfigService extends Configuration {
  constructor() {
    super();
  }
}
