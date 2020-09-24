export let env: string = '__buildEnv__'; // this will get set at build time

const BASE_URL = 'webapp.com/api';

const resources = {
  dev: {
    user: `https://dev.${BASE_URL}/users`,
    device: false,
  },
  prod: {
    user: `https://${BASE_URL}/users`,
    device: true,
  }
};

export const APIs = resources[env];
