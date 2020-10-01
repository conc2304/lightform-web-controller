import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'lf-web-components',
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
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
