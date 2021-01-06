export let env: string = '__buildEnv__'; // this will get set at build time
export let internalBuildFlag: string = '__buildInternal__';

const isInternal = internalBuildFlag === 'true';

interface EnvConfig {
  apiUrl: string;
  device: boolean;
  internalOnly: boolean;
}

interface ResourceObj {
  [key: string]: EnvConfig;
}

const resources: ResourceObj = {
  dev: {
    apiUrl: `http://192.168.1.107:8080`, // personal device's IP Address
    device: false,
    internalOnly: isInternal,
  },
  prod: {
    apiUrl: `http://${window.location.hostname}:8080`,
    device: true,
    internalOnly: isInternal,
  },
  device: {
    apiUrl: null,
    device: true,
    internalOnly: isInternal,
  },
};

export const LfConf = resources[env];
