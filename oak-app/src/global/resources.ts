export let env: string = '__buildEnv__'; // this will get set at build time
export let internalBuildFlag: string = '__buildInternal__';

const isInternal = internalBuildFlag === 'true';

interface EnvConfig {
  apiUrl: string,
  internalOnly: boolean,
}

interface ResourceObj {
  [key: string]: EnvConfig;
}

const resources: ResourceObj = {
  dev: {
    apiUrl: `https://api.dev.cloud.lightform.com/v/1`,
    internalOnly: isInternal,
  },
  prod: {
    apiUrl: `https://api.cloud.lightform.com/v/1`,
    internalOnly: isInternal,
  },
};

export const LfConf = resources[env];
