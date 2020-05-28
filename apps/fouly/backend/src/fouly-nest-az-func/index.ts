import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { createApp } from '../main.azure';
/**
 * Bootstraps the nest application within an azure function
 */
export default function(context: Context, req: HttpRequest): void {
  AzureHttpAdapter.handle(createApp, context, req);
}
