import { LfDevice, LfProjectMetadata } from "../interfaces/lf-web-controller.interface";
import LfLoggerService from "./lf-logger.service";

const log = new LfLoggerService("LfUtils").logger;

export function findDeviceByKeyValue(devices: Array<LfDevice>, key: string, value: any): LfDevice | void {
  log.debug('findDeviceByKeyValue');

  let deviceFound: LfDevice;
  if (!devices?.length) return deviceFound;

  devices.forEach((device: LfDevice) => {
    if (device[key] === value) {
      deviceFound = device;
      return;
    }
  });

  return deviceFound;
}

export function getProjectIndex(projects: Array<LfProjectMetadata>, projectId: string): number | null {
  log.debug('getProjectIndex');

  let projectIndex: number | null;
  projects.forEach((project: LfProjectMetadata, index: number) => {
    if (projectId == project.id) {
      projectIndex = project.index || index;
      return;
    }
  });
  return projectIndex
}

export function deviceNameMatch(deviceA: string, deviceB: string) {
  log.debug('deviceNameMatch');

  return formatName(deviceA) === formatName(deviceB);

  function formatName(str: string) {
    return str.replace('-', '').trim().toLowerCase();
  }
}

export function mapValue(value: number, low1: number, high1: number, low2: number, high2: number): number {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

export function cutoff(value: number, maxValue: number): number {
  return value < maxValue ? value : maxValue;
}



