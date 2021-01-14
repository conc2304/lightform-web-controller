import { LfDevice, LfProjectMetadata } from "../interfaces/lf-web-controller.interface";

export function findDeviceByKeyValue(devices: Array<LfDevice>, key: string, value: any): LfDevice | void {
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
  let projectIndex: number | null;
  projects.forEach((project: LfProjectMetadata, index: number) => {
    if (projectId == project.id) {
      projectIndex = project.index || index;
      return
    }
  });
  return projectIndex
}
