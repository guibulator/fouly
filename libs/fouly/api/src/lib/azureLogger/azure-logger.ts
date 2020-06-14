import { Inject, Injectable, Logger as NestLogger, Optional } from '@nestjs/common';
@Injectable()
export class Logger extends NestLogger {
  constructor(
    @Inject('AZURECONTEXT') private azureContext: any,
    @Optional() context?: string,
    @Optional() isTimestampEnabled?: boolean
  ) {
    super(context, isTimestampEnabled);
  }

  log(message: any, context?: string) {
    this.azureContext().log.info(message);
  }
  error(message: any, trace?: string, context?: string) {
    this.azureContext().log.error(message);
  }
  warn(message: any, context?: string) {
    this.azureContext().log.warn(message);
  }
  debug(message: any, context?: string) {
    this.azureContext().log.verbose(message);
  }
  verbose(message: any, context?: string) {
    this.azureContext().log.info(message);
  }
}
