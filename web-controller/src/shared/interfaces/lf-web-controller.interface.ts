// ==== Library Imports =======================================================
// none

// ==== App Imports ===========================================================
// none
export type LfDeviceStatus = "Playing" | "Stopped" | "Idle" | "Uploading" | "Down" | "Paused" | "Unknown";
export interface LfScene {
  sceneImgURl?: string;
  name: string;
  description?: string;
  duration?: number;
  id?: number,
  projectId?: string,
  index?: number,
  type: "creator" | "slide" | "hdmi",
}

export interface LfExperience {
  title: string,
  scenes: Array<LfScene>,
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
  name: string,
  serialNumber: string,
  createdAt: string,
  owner: string,
  model?: string,
}


export interface LfProjectMetadata {
  id: string,
  name: string,
  slides: Array<LfScene>
}
export interface LfDevicePlaybackState {
  globalBrightness: number,
  projectMetadata: Array<LfProjectMetadata>,
  slide: number,
  status: LfDeviceStatus,
}

export interface LfDeviceProps {
  availableFirmwareVersion: string,
  brightness: number
  cableStatus: string,
  firmwareVersion: string,
  hResolution: number,
  hostname: string,
  manufacturedAt: string,
  offlineSince: string,
  partNumber: string,
  refreshRate: number,
  status: string,
  vResolution: number,
  model?: string,
}

export interface LfResolution {
  width: number,
  height: number,
  fps: number,
}

export interface LfUser {
  firstName: string,
  lastName: string,
  email: string,
  createdAt: string,
  id: string,
}

export interface LfViewportBreakpoint{
  name: string,
  minWidth: string,
  maxWidth: string,
}

