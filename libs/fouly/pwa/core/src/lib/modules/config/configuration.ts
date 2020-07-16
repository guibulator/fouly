export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Configuration {
  production: boolean;
  enableDebugTools: boolean;
  logLevel: LogLevel;
  apiUrl: string;
  apiHost: string;
  version: string;
  authProvidersId: {
    google: string;
    facebook: string;
  };
}
