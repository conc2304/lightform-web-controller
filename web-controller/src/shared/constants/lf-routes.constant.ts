export interface LfAppRoute {
  label: string;
  url: string;
  component: string;
  navbarIconUrl?: string | null;
  order: number | null;
  inPrimaryNav: boolean;
  displayAppNav: boolean;
}
export interface LfRoutes {
  home: LfAppRoute,
  control: LfAppRoute,
  controlFallback: LfAppRoute,
  account: LfAppRoute,
  deviceInfo: LfAppRoute,
  login: LfAppRoute,
  registerDevice: LfAppRoute,
  sceneInit: LfAppRoute,
  sceneAlignment: LfAppRoute,
  fallback: LfAppRoute,
}

export const LF_ROUTES: LfRoutes = {
  home: {
    label: 'home',
    url: '/',
    component: 'page-home',
    navbarIconUrl: '/assets/icons/home.svg',
    order: 0,
    inPrimaryNav: true,
    displayAppNav: true,
  },
  control: {
    label: 'control',
    url: '/control/devices/:deviceName',
    component: 'page-control',
    navbarIconUrl: '/assets/icons/control.svg',
    order: 1,
    inPrimaryNav: true,
    displayAppNav: true,
  },
  controlFallback: {
    label: 'control',
    url: '/control',
    component: 'page-control',
    navbarIconUrl: null,
    order: null,
    inPrimaryNav: false,
    displayAppNav: true,
  },
  account: {
    label: 'account',
    url: '/account',
    component: 'page-account',
    navbarIconUrl: '/assets/icons/profile.svg',
    order: 2,
    inPrimaryNav: true,
    displayAppNav: true,
  },
  deviceInfo: {
    label: 'devices info',
    url: '/account/devices/:deviceName',
    component: 'page-device',
    navbarIconUrl: null,
    order: null,
    inPrimaryNav: false,
    displayAppNav: true,
  },
  login: {
    label: 'login',
    url: '/login',
    component: 'page-login',
    navbarIconUrl: null,
    order: null,
    inPrimaryNav: false,
    displayAppNav: true,
  },
  registerDevice: {
    label: 'register',
    url: '/register',
    component: 'page-registration',
    navbarIconUrl: null,
    order: null,
    inPrimaryNav: false,
    displayAppNav: true,
  },
  sceneInit: {
    label: 'scene setup',
    url: '/scene-setup',
    component: 'lf-scene-setup-root',
    navbarIconUrl: null,
    order: null,
    inPrimaryNav: false,
    displayAppNav: true,
  },
  sceneAlignment: {
    label: 'scene alignment',
    url: '/scene-setup/align/:scanType',
    component: 'lf-scene-setup-scan-completed',
    navbarIconUrl: null,
    order: null,
    inPrimaryNav: false,
    displayAppNav: true,
  },
  fallback: {
    label: 'fallback',
    url: '*',
    component: 'page-home',
    navbarIconUrl: null,
    order: null,
    inPrimaryNav: false,
    displayAppNav: true,
  },
};
