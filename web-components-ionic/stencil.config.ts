import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  plugins: [
    sass({
      includePaths: [
        'src/global/',
      ],
      injectGlobalPaths: [
        'src/global/app.css',
        'src/global/styles.scss',
        'src/global/_variables.scss',
        'src/global/_mixins.scss',
      ]
    })
  ],
  outputTargets: [{
    type: 'www',
    serviceWorker: null
  }],
};
