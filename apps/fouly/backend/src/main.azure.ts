import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@skare/fouly/api';
import { BootstrapModule } from './bootstrap.module';

export function createAppWithLogger(contextAccessor: () => any) {
  return async (): Promise<INestApplication> => {
    const app = await NestFactory.create(
      BootstrapModule.forRoot({ ignoreEnvFile: true, isGlobal: true }, contextAccessor),
      {
        logger: false
      }
    );
    app.useLogger(app.get(Logger));
    app.setGlobalPrefix('api');

    await app.init();
    return app;
  };
}
