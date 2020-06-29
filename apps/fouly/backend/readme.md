## Backend

We are using [NestJS](https://nestjs.com/) as our main API which is deployed to an azure function.
The lib containing modules and controllers is located under `libs/fouly/api`.
This project only configures the Azure Function that acts as an API gateway.

## Development

There are 2 options to test the app locally:

1. The easiest way is to test using the nestjs local server that you can start with `ng serve fouly-backend`
   If you want to debug using node debugger simply do `ng serve fouly-backend --port=50818` and attach the debugger by running the `Attach to fouly-backend`. The port 50818 is already configured in launch.json for this project.
   When using this option, you can access the Swagger documentation at `http://localhost:3333/api`

1. If you want to run the function with a simulated host, install the azure core tools `yarn add -g azure-functions-core-tools@3` and see [Working with azure functions core tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cbash)
   Run `ng run fouly-backend:build-local-azure` (There is a custom build that will be generated under `dist/apps/fouly/backend-local-azure`)
   From the `apps/fouly/backend/src` directory, which acts as the Function App, run `func host start`. This will start the function locally and use the backend-local-azure previously built with its sourcemaps.

## Environment configuration

In order to get the latest configuration to run the backend locally, you need to sync the FunctionApp configuration with a local file named .env.
Simply run the tool under `.\tools\powershell\azure\ReadEnvFromFunctionApp.psq`.
**NB**: You must specify the tenant in case your account is link with multiple tenant
`az login --tenant 798152d6-db45-47e7-a4c8-6ffba45f1a0a`

For **production** environment, you need to switch your default subscription to the production one -> `az account set --subscription fouly-subscription-prod`

You can then run the script and enter the following when asked

1. function app name: **foulyapigatewayprod**
1. resource group: **fouly-prod-rg-e2**

For **development** environment, you need to switch your default subscription to the dev one -> `az account set --subscription skare-subscription-dev`

You can then run the script and enter the following when asked

1. function app name: **foulyapigateway**
1. resource group: **fouly-dev-rg**

This will set on your clipboard the content of all the secrets for the specified in the Function App. You then create a file named `.env` under src and paste the content in it.
