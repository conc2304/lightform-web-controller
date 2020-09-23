import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import dotenvPlugin from "rollup-plugin-dotenv";

// https://stenciljs.com/docs/config

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  plugins: [
    dotenvPlugin(),
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
      copy: [],
    }
  ],
};
