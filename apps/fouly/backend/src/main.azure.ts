import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BootstrapModule } from './bootstrap.module';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(
    BootstrapModule.forRoot({ ignoreEnvFile: true, isGlobal: true }),
    {
      logger: console
    }
  );
  app.setGlobalPrefix('api');

  await app.init();
  return app;
}
