## Backend

We are using [NestJS](https://nestjs.com/) as our main API which is deployed to an azure function.
The lib containing modules and controllers is located under libs/fouly/api.
This project only configures the Azure Function that acts as an API gateway.

## Development

During development you want to be able to debug the azure function as it would run on azure.

    `yarn add -g azure-functions-core-tools@3`

See [Work with azure functions core tolls](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cbash)

1. build the function, run `ng build fouly-backend`
2. from the src directory, run `func host start`, this will start the function locally
