export let env: string = '__buildEnv__'; // this will get set at build time

interface EnvConfig {
  apiUrl: string,
  apiHost: string,
  imageHost: string,
  device: boolean,
  dev: boolean,
}

interface ResourceObj {
  [key: string]: EnvConfig,
}

const apiHost = `http://${window.location.hostname}:${window.location.port}`;
const imageHost = `${apiHost}/assets/images`;

const resources: ResourceObj = {
  dev: {
    apiUrl: `http://192.168.1.107:8080`,
    apiHost: apiHost,
    imageHost: imageHost,
    device: false,
    dev: true,
  },
  prod: {
    apiUrl: `http://${window.location.hostname}:8080`,
    apiHost: apiHost,
    imageHost: imageHost,
    device: true,
    dev: false,
  }
};

export const LfConf = resources[env];
