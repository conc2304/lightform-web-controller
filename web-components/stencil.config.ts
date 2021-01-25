import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

const sharableBuildDir = "dist-internal";
export const config: Config = {
  namespace: "lf-web-components",
  taskQueue: "async",
  plugins: [
    sass({
      includePaths: ["src/_common/"],
      injectGlobalPaths: ["src/_common/_variables.scss"],
    }),
  ],
  outputTargets: [
    // Distribution for Local Consumption
    {
      type: "dist-custom-elements-bundle",
      dir: "dist/custom-elements",
      externalRuntime: false,
      inlineDynamicImports: true,
    },
    {
      type: "dist",
      dir: "dist/lib",
    },
    // Marketing Build
    {
      type: "dist-custom-elements-bundle",
      dir: sharableBuildDir,
      externalRuntime: false,
      inlineDynamicImports: true,
      copy: [
        { src: "assets", dest: `${sharableBuildDir}/assets` },
        {
          src: "dist.html",
          dest: `${sharableBuildDir}/index.html`,
        },
      ],
      empty: true,
    },
    // Create Documentation
    {
      type: "docs-readme",
    },
    // Build Web from index.html
    {
      type: "www",
      dir: "public_html",
      serviceWorker: null, // disable service workers
      copy: [
        { src: "assets/fonts", dest: "assets/fonts" },
        { src: "assets/css", dest: "assets/css" },
      ],
    },
  ],
};
