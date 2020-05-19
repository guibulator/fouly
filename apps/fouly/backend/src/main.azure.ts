import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FoulyApiModule } from '@skare/fouly/api';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(FoulyApiModule);
  app.setGlobalPrefix('api');

  await app.init();
  return app;
}
