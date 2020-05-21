/**
 * This entry point is there for debugging purposes. The app is deployed
 * as an azure function through the main.azure.ts
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FoulyApiModule } from '@skare/fouly/api';

async function bootstrap() {
  const app = await NestFactory.create(FoulyApiModule, { logger: console });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
