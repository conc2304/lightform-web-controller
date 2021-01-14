// ==== Library Imports =======================================================
import { createStore } from '@stencil/store';

// ==== App Imports ===========================================================
import { LfDevice, LfDevicePlaybackState, LfProjectMetadata, LfScene, LfUser } from '../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../shared/services/lf-logger.service';
import lfRemoteApiAuthService from '../shared/services/lf-remote-api/lf-remote-api-auth.service';
import lfRemoteApiDeviceService from '../shared/services/lf-remote-api/lf-remote-api-device.service';
import { findDeviceByKeyValue } from '../shared/services/lf_utils.service';

interface LfAppState {
  deviceSelected: LfDevice;
  registeredDevices: Array<LfDevice>;
  sceneSelected: LfScene;
  experiences: Array<LfProjectMetadata>;
  user: LfUser;
  mobileLayout: boolean;
  accountDeviceSelected: LfDevice;
  playbackState: LfDevicePlaybackState;
  projectSelectedName: string;
}

// Own Properties
// --------------------------------------------------------
const log = new LfLoggerService('LfAppState').logger;

// App State Initialization
// --------------------------------------------------------
const { state, onChange } = createStore({
  deviceSelected: null,
  registeredDevices: null,
  sceneSelected: null,
  experiences: null,
  user: null,
  mobileLayout: null,
  accountDeviceSelected: null,
  playbackState: null,
  projectSelectedName: null,
} as LfAppState);

// onStateChange Watchers
// --------------------------------------------------------
onChange('deviceSelected', device => {
  log.info("onChange 'deviceSelected'", device);

  // Update the Playback State for the Device Globally
  if (device) {
    lfRemoteApiDeviceService.getPlaybackState(device.serialNumber).then(res => {
      const response = res.response;
      const json = res.body;

      // <<<<<<< HEAD
      if (!response.ok) {
        const errorMsg = json.message || 'Unable to get Playback State for: ' + device.name;
        return Promise.reject(errorMsg);
      } else {
        const playbackState = json
        const projectIdActive = playbackState.project;

        playbackState.projectMetadata.map((project: LfProjectMetadata, projectIndex: number) => {
          project.slides.map((slide: LfScene, slideIndex: number) => {
            slide.projectId = project.id
            slide.index = slideIndex;
            slide.projectName = project.name;
          });

          project.index = projectIndex;

          if (project.id = projectIdActive) {
            state.projectSelectedName = project.name;
          }
        });

        state.playbackState = playbackState;
      }
    });
  }

  const value = device || "";
  const event = new CustomEvent('_deviceSelected', { detail: value });
  document.dispatchEvent(event);

  if (device) {
    localStorage.setItem("lastDeviceSelectedSerial", JSON.stringify(device.serialNumber));
  }
});

onChange('registeredDevices', registeredDevices => {
  log.info("onChange 'mobileLayout'", registeredDevices);
  const event = new CustomEvent('_registeredDevicesUpdated', { detail: registeredDevices });
  document.dispatchEvent(event);
});

onChange('mobileLayout', mobileLayout => {
  log.info("onChange 'mobileLayout'", mobileLayout);
  const event = new CustomEvent('_layoutUpdated', { detail: mobileLayout });
  document.dispatchEvent(event);
});

onChange('playbackState', user => {
  log.info("onChange 'playbackState'", user);
  const event = new CustomEvent('_playbackStateUpdated', { detail: user });
  document.dispatchEvent(event);
});

onChange('projectSelectedName', user => {
  log.info("onChange 'projectSelectedName'", user);
  const event = new CustomEvent('_projectSelectedUpdated', { detail: user });
  document.dispatchEvent(event);
});

onChange('user', user => {
  log.info("onChange 'user'", user);
  const event = new CustomEvent('_userUpdated', { detail: user });
  document.dispatchEvent(event);
});


// Private Methods
// --------------------------------------------------------
export async function initializeData(): Promise<void> {
  log.debug('initializeData');

  await lfRemoteApiAuthService.getCurrentUser().then(res => {
    const response = res.response;
    const json = res.body;

    if (response.status == 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } else {
      state.user = json;
    }
  });

  await lfRemoteApiDeviceService
    .getDevices(true)
    .then(res => {
      const response = res.response;
      const json = res.body;

      if (!response.ok) {
        let errorMsg = 'Unable to retrieve your Lightform Devices';
        return Promise.reject(errorMsg);
      } else {
        return Promise.resolve(json._embedded.devices);
      }
    })
    .then((devices: Array<LfDevice>) => {
      const lastDeviceSavedSerial = localStorage.getItem('lastDeviceSelectedSerial');
      let deviceSelected: LfDevice;
      const targetDevice = findDeviceByKeyValue(devices, 'serialNumber', JSON.parse(lastDeviceSavedSerial));

      if (lastDeviceSavedSerial && targetDevice) {
        const device: LfDevice = targetDevice;
        deviceSelected = device;
      } else {
        deviceSelected = devices[0];
      }

      state.registeredDevices = devices;
      state.deviceSelected = deviceSelected;
    })
    .catch(error => {
      log.error(error);
    });
}

export default state as LfAppState;
