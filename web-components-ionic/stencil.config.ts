import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  plugins: [
    sass({
      includePaths: [
        'src/_common/',
      ],
      injectGlobalPaths: [
        'src/_common/styles.scss',
        'src/_common/_variables.scss',
        'src/_common/_mixins.scss',
      ]
    })
  ],
  outputTargets: [{
    type: 'www',
    serviceWorker: null
  }],
};
