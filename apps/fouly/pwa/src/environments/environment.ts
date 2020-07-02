/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import { Configuration } from '@skare/fouly/pwa/core';
import 'zone.js/dist/zone-error'; // Included with Angular CLI.

const apiHost = 'localhost:4200';
const apiUrl = `http://${apiHost}/api`;
export const environment: Configuration = {
  production: false,
  apiHost: apiHost,
  apiUrl: apiUrl,
  logLevel: 'debug',
  enableDebugTools: true,
  version: '0.0.1'
};
