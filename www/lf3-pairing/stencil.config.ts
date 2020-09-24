import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import replace from '@rollup/plugin-replace';


// https://stenciljs.com/docs/config

// set env variables at build time to select env in `/global/resources.ts`
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;
const apiEnv: string = dev ? 'dev' : 'prod';

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
    }),
    replace({
      exclude: 'node_modules/**',
      values: { __buildEnv__: apiEnv }
    }),
  ],
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      copy: [],
    }
  ],
};
