import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// https://stenciljs.com/docs/config

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
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        // {
        //   src: '../node_modules/simple-keyboard/build/css/index.css',
        //   dest: "assets/css/simple-keyboard.css",
        //   warn: true
        // }
      ]
    }
  ],
};
