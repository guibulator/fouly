import { Configuration } from '@skare/fouly/pwa/core';
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
const apiHost = 'foulyapigateway.azurewebsites.net';
const apiUrl = `https://${apiHost}/api`;
export const environment: Configuration = {
  production: true,
  apiHost: apiHost,
  apiUrl: apiUrl,
  logLevel: 'info',
  enableDebugTools: true
};
