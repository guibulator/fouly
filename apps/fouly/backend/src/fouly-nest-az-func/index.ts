import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { createAppWithLogger } from '../main.azure';
/**
 * Bootstraps the nest application within an azure function
 */
let curContext;
const azContextAccessor = () => curContext;

export default function(context: Context, req: HttpRequest): void {
  curContext = context;
  const done = context.done;
  context.done = (err?: string | Error, result?: any) => {
    done(err, result);
    curContext = null;
  };
  AzureHttpAdapter.handle(createAppWithLogger(azContextAccessor), context, req);
}
