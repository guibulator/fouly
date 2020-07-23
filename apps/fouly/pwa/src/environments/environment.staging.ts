import { Configuration } from '@skare/fouly/pwa/core';
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
const apiHost = 'foulyapigateway.azurewebsites.net';
const apiUrl = `https://${apiHost}/api`;
export const environment: Configuration = {
  production: true,
  apiHost: apiHost,
  apiUrl: apiUrl,
  logLevel: 'info',
  enableDebugTools: true,
  version: '#{version}#',
  authProvidersId: {
    google: '564951534226-pd2d4v8f6oqn69tgm6i4bof21bodu0in.apps.googleusercontent.com',
    facebook: '250123776255481'
  }
};
