import { IEnvironment } from './ienvironment';

const apiHost = 'fouly.ca';
const apiUrl = `https://${apiHost}/api`;
export const environment: IEnvironment = {
  production: true,
  apiHost: apiHost,
  apiUrl: apiUrl,
  logLevel: 'info',
  enableDebugTools: true
};
