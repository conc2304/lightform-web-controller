import { LfAppRoute } from '../interfaces/lf-web-controller.interface';

export const LF_ROUTES: Array<LfAppRoute> = [
  {
    label: 'home',
    url: '/',
    component: 'page-home',
    navbarIconUrl: '/assets/icons/home.svg',
    order: 0,
    inPrimaryNav: true,
  },
  {
    label: 'control',
    url: '/control',
    component: 'page-control',
    navbarIconUrl: '/assets/icons/control.svg',
    order: 1,
    inPrimaryNav: true,
  },
  {
    label: 'account',
    url: '/account',
    component: 'page-account',
    navbarIconUrl: '/assets/icons/profile.svg',
    order: 2,
    inPrimaryNav: true,
  },
  {
    label: 'devices',
    url: '/account/devices/:deviceName',
    component: 'page-device',
    navbarIconUrl: null,
    order: null,
    inPrimaryNav: false,
  },

  {
    label: 'login',
    url: '/login',
    component: 'page-login',
    navbarIconUrl: null,
    order: null,
    inPrimaryNav: false,
  },
];
