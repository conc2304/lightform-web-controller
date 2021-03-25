// ==== Library Imports =======================================================
// none

import { LfProjectType } from '../enums/lf-project-type.enum';

// ==== App Imports ===========================================================
// none

export type LfDeviceStatus = 'Playing' | 'Stopped' | 'Idle' | 'Uploading' | 'Down' | 'Paused' | 'Unknown';
export type LfSceneType = 'creator' | 'slide' | 'hdmi';

export enum LfHeaderBarMode {
  DEVICE_SELECTOR,
  DEVICE_VIEWER,
  ENVIRONMENT_CATEGORY
}

export interface LfEnvironmentCategoriesObject {
  title: string;
  url: string;
  imgUrl: string;
}
export interface LfScene {
  thumbnail?: string;
  name: string;
  category?: string;
  description?: string;
  duration?: string;
  id?: number;
  projectId?: string;
  projectName?: string;
  index?: number;
  type?: LfSceneType;
}

export interface LfRestResponse {
  response: Response,
  body: any,
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

export interface LfProjectDownloadProgress {
  [key:string]: number,  // projectId progress as percentage
}

export interface LfProjectMetadata {
  id: string | null;
  name: string;
  slides: Array<LfScene>;
  description?: string;
  index?: number,
  type: LfProjectType,
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
  lightEngineOn?: boolean;
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
  projectDownloadProgress?: LfProjectDownloadProgress,
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

export interface LfRpcResponseError {
  code: number,
  data: {
    error: string,
    message: string,
  }
  message: string,
}


export interface LfRpcResponse {
  id: number,
  jsonrpc: string,
  result?: any,
  error: LfRpcResponseError,
}
export interface LfErrorTemplate {
  message: string,
  search: string,
  replace: string,
}

export interface LfObjectDetails {
  name: string,
  type: string,
  classId: string,
  id: string
}

export interface LfValidator<A> {
  validate: (x: A) => boolean;
  errorMessage?: string;
}

export type LfDeviceScanType = 'object' | 'environment';

