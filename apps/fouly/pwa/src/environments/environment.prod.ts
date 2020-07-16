import { Configuration } from '@skare/fouly/pwa/core';

const apiHost = 'foulyapigatewayprod.azurewebsites.net';
const apiUrl = `https://${apiHost}/api`;
export const environment: Configuration = {
  production: true,
  apiHost: apiHost,
  apiUrl: apiUrl,
  logLevel: 'info',
  enableDebugTools: true,
  version: '#{version}#',
  authProvidersId: {
    google: '316973135009-3sn6m7vc4313q36g4lnec9ttqmpo7l2s.apps.googleusercontent.com',
    facebook: '250123776255481'
  }
};
