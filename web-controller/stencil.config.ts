import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import replace from '@rollup/plugin-replace';

// https://stenciljs.com/docs/config

// set env variables at build time to select env in `/global/resources.ts`
// @ts-ignore
const dev = true;
// @ts-ignore
const debug: string = dev && process.argv && process.argv.indexOf('--debug') > -1 ? 'debug' : '';
const apiEnv = 'dev'; // || 'prod' // currently only dev api

// @ts-ignore
console.log(process.arg);
console.log(`Dev: ${dev}`);
console.log(`Build Environment:   ${apiEnv}`);

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  plugins: [
    sass({
      includePaths: [ 'src/_common/' ],
      injectGlobalPaths: [ 'src/global/_variables.scss', 'src/global/_mixins.scss' ],
    }),
    replace({
      exclude: 'node_modules/**',
      include: 'src/**',
      preventAssignment: true,
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
      copy: [
        { src: 'assets/images', dest: 'assets/images' },
        { src: 'offline.html', dest: 'offline.html' },
        { src: 'browserconfig.xml', dest: 'browserconfig.xml' },
      ],
      baseUrl: '/',
      empty: true,
      buildDir: 'build',
      serviceWorker: {
        globPatterns: [
          '**/*.{eot,woff,woff2,js,css,json,html,ico,png,jpg,jpeg}'
        ],
        swSrc: 'src/lf-sw.js',
      },
    },
  ],
};
