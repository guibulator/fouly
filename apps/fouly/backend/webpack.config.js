/**
 * This is required in order for swagger to infer documentation of models and dto.
 * this file is referenced in angular.json under builder options.
 * https://docs.nestjs.com/recipes/swagger
 * Solution inspired by https://github.com/nrwl/nx/issues/2147
 */
const swaggerPlugin = require('@nestjs/swagger/plugin');
const webpack = require('webpack');
module.exports = (config, context) => {
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      openapi: '@nestjs/swagger'
    })
  ];
  for (const rule of config.module.rules) {
    if (rule.loader !== 'ts-loader') {
      continue;
    }

    rule.options.getCustomTransformers = (program) => ({
      before: [
        swaggerPlugin.before(
          {
            dtoFileNameSuffix: ['.command.ts', '.query.ts', '.result.ts']
          },
          program
        )
      ]
    });
  }

  return config;
};
