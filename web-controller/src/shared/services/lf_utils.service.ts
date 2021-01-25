import { LfDevice, LfProjectMetadata } from "../interfaces/lf-web-controller.interface";
import LfLoggerService from "./lf-logger.service";

const log = new LfLoggerService("LfUtils").logger;

export function findDeviceByKeyValue(devices: Array<LfDevice>, key: string, value: any): LfDevice | void {
  log.debug('findDeviceByKeyValue');
  
  let deviceFound: LfDevice;
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
      return
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
