/**
 * This entry point is there for debugging purposes. The app is deployed
 * as an azure function through the main.azure.ts
 */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BootstrapModule } from './bootstrap.module';

async function bootstrap() {
  const app = await NestFactory.create(
    BootstrapModule.forRoot({ envFilePath: './apps/fouly/backend/src/.env', isGlobal: true }),
    { logger: console }
  );
  const options = new DocumentBuilder()
    .setTitle('Fouly')
    .setDescription('Fouly - API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
