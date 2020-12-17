// ==== Library Imports =======================================================
import { createStore } from "@stencil/store";

// ==== App Imports ===========================================================
import { LfDevice, LfDevicePlaybackState, LfExperience, LfScene, LfUser } from "../shared/interfaces/lf-web-controller.interface";
import LfLoggerService from "../shared/services/lf-logger.service";
import lfRemoteApiAuthService from "../shared/services/lf-remote-api/lf-remote-api-auth.service";
import lfRemoteApiDeviceService from "../shared/services/lf-remote-api/lf-remote-api-device.service";

interface LfAppState {
  deviceSelected: LfDevice,
  registeredDevices: Array<LfDevice>,
  sceneSelected: LfScene,
  experiences: Array<LfExperience>,
  user: LfUser,
  headerBarState: "Device Selector" | "Device Viewer",
  mobileLayout: boolean,
  accountDeviceSelected: LfDevice,
  playbackState: LfDevicePlaybackState,
  currentPath: string,
}

// Own Properties
// --------------------------------------------------------
const log = new LfLoggerService('LfAppState').logger;

// App State Initialization
// --------------------------------------------------------
const { state, onChange } = createStore(
  {
    deviceSelected: null,
    registeredDevices: null,
    sceneSelected: null,
    experiences: null,
    user: null,
    mobileLayout: null,
    headerBarState: "Device Selector",
    accountDeviceSelected: null,
    playbackState: null,
    currentPath: "/",
  } as LfAppState);


// onStateChange Watchers
// --------------------------------------------------------
onChange('deviceSelected', device => {
  log.info("onChange 'deviceSelected'", device);

  // Update the Playback State for the Device Globally
  lfRemoteApiDeviceService.getPlaybackState(device.serialNumber).then(res => {
    const response = res.response;
    const json = res.body;

    if (!response.ok) {
      let errorMsg = json.message || 'Unable to get Playback State for: ' + device.name;
      return Promise.reject(errorMsg);
    } else {
      state.playbackState = json;
    }
  });

  const event = new CustomEvent('_deviceSelected', { detail: device });
  localStorage.setItem("lastDeviceSelected", JSON.stringify(device));
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

onChange('user', user => {
  log.info("onChange 'user'", user);
  const event = new CustomEvent('_userUpdated', { detail: user });
  document.dispatchEvent(event);
});

onChange('sceneSelected', value => {
  log.info("onChange 'sceneSelected'", value);
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

      if (window.location.pathname !== "/login") {
        window.location.pathname = '/login';
      }
    } else {
      state.user = json
    }
  });


  await lfRemoteApiDeviceService
    .getDevices(false)
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
      const lastDeviceSaved = localStorage.getItem('lastDeviceSelected');
      let deviceSelected: LfDevice;

      if (lastDeviceSaved && devices.includes(JSON.parse(lastDeviceSaved))) {
        const device: LfDevice = JSON.parse(lastDeviceSaved);
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


