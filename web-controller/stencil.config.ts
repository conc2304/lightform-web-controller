import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import replace from '@rollup/plugin-replace';

// https://stenciljs.com/docs/config

// set env variables at build time to select env in `/global/resources.ts`
// @ts-ignore
const dev: boolean = (process.argv && process.argv.indexOf('--dev') > -1) || process.argv.indexOf('test') > -1;
// @ts-ignore
const debug: string = dev && process.argv && process.argv.indexOf('--debug') > -1 ? 'debug' : '';
const apiEnv: string = dev ? 'dev' : 'prod';

console.log(`Build Environment:   ${apiEnv}`);

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  plugins: [
    sass({
      includePaths: ['src/_common/'],
      injectGlobalPaths: ['src/global/_variables.scss', 'src/global/_mixins.scss'],
    }),
    replace({
      exclude: 'node_modules/**',
      include: 'src/**',
      values: {
        __buildEnv__: apiEnv,
        __debugLog__: debug,
      },
    }),
  ],
  outputTargets: [
    {
      type: 'dist-custom-elements-bundle',
      dir: 'dist',
      externalRuntime: false,
      inlineDynamicImports: true,
      copy: [
        { src: 'assets', dest: 'dist/assets' },
        { src: 'dist.html', dest: 'dist/index.html' },
      ],
      empty: true,
    },

    {
      type: 'www',
      dir: 'public_html',
      serviceWorker: null,
      copy: [
        { src: 'assets/images', dest: 'assets/images' },
        { src: 'assets/fonts', dest: 'build/assets/fonts' },
      ],
      baseUrl: '/',
      empty: true,
      buildDir: 'build',
    },
  ],
};
