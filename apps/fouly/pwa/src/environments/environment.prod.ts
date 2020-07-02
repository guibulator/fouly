import { Configuration } from '@skare/fouly/pwa/core';

const apiHost = 'foulyapigatewayprod.azurewebsites.net';
const apiUrl = `https://${apiHost}/api`;
export const environment: Configuration = {
  production: true,
  apiHost: apiHost,
  apiUrl: apiUrl,
  logLevel: 'info',
  enableDebugTools: true,
  version: '#{version}#'
};
