export const env: string = '__buildEnv__'; // this will get set at build time
const isInternal = env === 'dev';

export interface EnvConfig {
  apiUrl: string;
  cdnUrl: string;
  internalOnly: boolean;
}

export interface ResourceObj {
  [ key: string ]: EnvConfig;
}

const resources: ResourceObj = {
  dev: {
    apiUrl: `https://api.dev.cloud.lightform.com/v/1`,
    cdnUrl: 'https://cdn.dev.cloud.lightform.com',
    internalOnly: isInternal,
  },
  prod: {
    apiUrl: `https://api.cloud.lightform.com/v/1`,
    cdnUrl: 'https://cdn.cloud.lightform.com',
    internalOnly: isInternal,
  },
};

export const LfConf = resources[ env ];
