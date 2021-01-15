// ==== Library Imports =======================================================
// none

// ==== App Imports ===========================================================
// none

export type LfDeviceStatus = 'Playing' | 'Stopped' | 'Idle' | 'Uploading' | 'Down' | 'Paused' | 'Unknown';

export enum LfHeaderBarMode {
  DEVICE_SELECTOR,
  DEVICE_VIEWER,
}
export interface LfScene {
  thumbnail?: string;
  name: string;
  description?: string;
  duration?: string;
  id?: number;
  projectId?: string;
  projectName?: string,
  index?: number;
  type: 'creator' | 'slide' | 'hdmi';
}

export interface LfAppRoute {
  label: string;
  url: string;
  component: string;
  navbarIconUrl?: string | null;
  order: number | null;
  inPrimaryNav: boolean;
}

export interface LfDevice {
  name: string;
  serialNumber: string;
  createdAt: string;
  owner: string;
  model?: string;
  _embedded?: {
    info: LfDeviceProps;
  }
}
export interface LfProjectMetadata {
  id: string | null;
  name: string;
  slides: Array<LfScene>;
  index?: number,
}
export interface LfDevicePlaybackState {
  globalBrightness: number;
  project?: string,
  globalVolume?: number;
  projectMetadata: Array<LfProjectMetadata>;
  slide: number;
  status: LfDeviceStatus;
}

export interface LfDeviceProps {
  availableFirmwareVersion: string;
  brightness: number;
  cableStatus: string;
  firmwareVersion: string;
  hResolution: number;
  hostname: string;
  manufacturedAt: string;
  offlineSince: string;
  partNumber: string;
  refreshRate: number;
  status: LfDeviceStatus;
  vResolution: number;
  model?: string;
}

export interface LfResolution {
  width: number;
  height: number;
  fps: number;
}

export interface LfUser {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  id: string;
}

export interface LfViewportBreakpoint {
  name: string;
  minWidth: string;
  maxWidth: string;
}

export interface LfResponseError {
  code: number,
  data: {
    message: string,
  }
  message: string,
}

export interface LfErrorTemplate {
  message: string,
  search: string,
  replace: string,
}

