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
        'src/_common/_variables.scss',
      ]
    })
  ],
  outputTargets: [
    {
      type: 'dist-custom-elements-bundle',
      externalRuntime: false,
      inlineDynamicImports: true
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        { src: "../../www/fonts/AtlasGrotesk", dest: "assets/fonts" }
      ]
    },
  ],
};
