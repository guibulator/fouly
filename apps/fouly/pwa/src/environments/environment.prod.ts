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
    google: '564951534226-h6dqiafbuq8b38adi8h5uos8u0mq69dl.apps.googleusercontent.com',
    facebook: '250123776255481'
  }
};
