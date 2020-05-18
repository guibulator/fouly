# skare monorepo

for this project, we use yarn and not npm.

We are using lerna & yarn workspaces to efficiently manage dependencies accross all projects. When
building a library that needs its own package to be deployed with it like an Azure Function, the project
should have its own package.json. Thanks to lerna and yarn workspaces, managing versions in a mono repo is a lot easier.
This means that every project and lib in this repo share the same version.

We are also using NX to efficiently manage apps and libs in a mono-repo fashion.
The idea behing the mono repo approach is to never write the same code twice.

## Getting started

1. `npm i -g yarn`
1. `yarn bootstrap` (This will install all dependencies)
1. `yarn clean` (To be executed to get freshly new packages)

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

Libraries are sharable across libraries and applications. They can be imported from `@skare/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## To remove an app or lib

This will remove from angular.json, nx.json and all files related to apps or libs.
Run `npm run nx g @nrwl/workspace:rm <app or lib name>`
