## Backend

We are using [NestJS](https://nestjs.com/) as our main API which is deployed to an azure function.
The lib containing modules and controllers is located under libs/fouly/api.
This project only configures the Azure Function that acts as an API gateway.

## Development

During development you want to be able to debug the azure function as it would run on azure.

    `yarn add -g azure-functions-core-tools@3`

See [Work with azure functions core tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cbash)

1. run `ng serve fouly-backend` (There is a custom build that will be generated under dist/apps/fouly/backend-local)
2. from the apps/fouly/backend/src directory, which acts as the Function App , run `func host start`. This will start the function locally and use the backend-local previous built with its sourcemaps
