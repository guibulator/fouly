/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
import { IEnvironment } from './ienvironment';

const apiHost = 'localhost:3333';
const apiUrl = `http://${apiHost}/api`;
export const environment: IEnvironment = {
  production: false,
  apiHost: apiHost,
  apiUrl: apiUrl,
  logLevel: 'debug',
  enableDebugTools: true
};
