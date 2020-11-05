export let env: string = '__buildEnv__'; // this will get set at build time

interface EnvConfig {
  apiUrl: string,
  device: boolean,
  dev: boolean,
}

interface ResourceObj {
  [key: string]: EnvConfig,
}


const resources: ResourceObj = {
  dev: {
    apiUrl: `http://192.168.1.107:8080`, // personal device's IP Address
    device: false,
    dev: true,
  },
  prod: {
    apiUrl: `http://${window.location.hostname}:8080`,
    device: true,
    dev: false,
  },
  device: {
    apiUrl: null,
    device: true,
    dev: false,
  }
};

export const LfConf = resources[env];
