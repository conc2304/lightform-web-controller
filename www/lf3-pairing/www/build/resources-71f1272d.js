let env = 'dev'; // this will get set at build time
const apiHost = `http://${window.location.hostname}:${window.location.port}`;
const imageHost = `${apiHost}/assets/images`;
const resources = {
  dev: {
    apiHost: apiHost,
    imageHost: imageHost,
    device: false,
    dev: true,
  },
  prod: {
    apiHost: apiHost,
    imageHost: imageHost,
    device: true,
    dev: false,
  }
};
const LfConf = resources[env];

export { LfConf as L };
