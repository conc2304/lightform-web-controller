// ==== Library Imports =======================================================
import { createStore } from '@stencil/store';
import JsLogger from 'js-logger';

// ==== App Imports ===========================================================
import { LfDevice, LfDevicePlaybackState, LfProjectMetadata, LfScene, LfUser, LfViewportBreakpoint } from '../shared/interfaces/lf-web-controller.interface';
import LfLoggerService from '../shared/services/lf-logger.service';
import lfRemoteApiAlignmentService from '../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfRemoteApiAuthService from '../shared/services/lf-remote-api/lf-remote-api-auth.service';
import lfRemoteApiDeviceService from '../shared/services/lf-remote-api/lf-remote-api-device.service';
import { findDeviceByKeyValue, getProjectIndex } from '../shared/services/lf-utils.service';

interface LfAppState {
  deviceSelected: LfDevice;
  registeredDevices: Array<LfDevice>;
  sceneSelected: LfScene;
  experiences: Array<LfProjectMetadata>;
  user: LfUser;
  mobileLayout: boolean;
  viewportSize: LfViewportBreakpoint;
  accountDeviceSelected: LfDevice;
  playbackState: LfDevicePlaybackState;
  projectSelectedName: string;
  deviceDataInitialized: boolean,
  appDataInitialized: boolean,
}

// Own Properties
// --------------------------------------------------------
const log = new LfLoggerService('LfAppState', JsLogger.ERROR).logger;

// App State Initialization
// --------------------------------------------------------
const { state, onChange } = createStore({
  deviceSelected: null,
  registeredDevices: null,
  sceneSelected: null,
  experiences: null,
  user: null,
  mobileLayout: null,
  viewportSize: null,
  accountDeviceSelected: null,
  playbackState: null,
  projectSelectedName: null,
  deviceDataInitialized: null,
  appDataInitialized: null,
} as LfAppState);

// onStateChange Watchers
// --------------------------------------------------------
onChange('deviceSelected', device => {
  log.info("onChange 'deviceSelected'", device);

  // Updates the playbackState and sceneSelected for the app globally
  if (device) {

    const lastDeviceSavedSerial: string = JSON.parse(localStorage.getItem('lastDeviceSelectedSerial'));
    if (lastDeviceSavedSerial) {
      lfRemoteApiAlignmentService.oaklightOff(lastDeviceSavedSerial);
    }

    state.deviceDataInitialized = false;

    updatePlaybackState(device);
  }

  const value = device || "";
  const event = new CustomEvent('_deviceSelected', { detail: value });
  document.dispatchEvent(event);

  if (device) {
    localStorage.setItem("lastDeviceSelectedSerial", JSON.stringify(device.serialNumber));
  }
});

onChange('sceneSelected', sceneSelected => {
  log.info("onChange 'sceneSelected'", sceneSelected);
  const event = new CustomEvent('_sceneSelectedUpdated', { detail: sceneSelected });
  document.dispatchEvent(event);
});

onChange('registeredDevices', registeredDevices => {
  log.info("onChange 'registeredDevices'", registeredDevices);
  const event = new CustomEvent('_registeredDevicesUpdated', { detail: registeredDevices });
  document.dispatchEvent(event);
});

onChange('mobileLayout', mobileLayout => {
  log.debug("onChange 'mobileLayout'", mobileLayout);
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

onChange('appDataInitialized', appDataInitialized => {
  log.info("onChange 'appDataInitialized'", appDataInitialized);
  const event = new CustomEvent('_appDataInitialized', { detail: appDataInitialized });
  document.dispatchEvent(event);
});

onChange('deviceDataInitialized', deviceDataInitialized => {
  log.info("onChange 'deviceDataInitialized'", deviceDataInitialized);
  const event = new CustomEvent('_deviceDataInitialized', { detail: deviceDataInitialized });
  document.dispatchEvent(event);
});



// Public Methods
// --------------------------------------------------------
export async function initializeData(): Promise<void> {
  log.debug('initializeData');

  await lfRemoteApiAuthService.getCurrentUser().then(res => {
    const response = res.response;
    const json = res.body;

    if (response.status == 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.pathname = '/login';
      return;
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
        log.error(errorMsg);
      } else {
        state.registeredDevices = json._embedded.devices;
      }
    })
    .finally(() => {
      state.appDataInitialized = true;
      state.deviceDataInitialized = true;
    });
}

export function initializeDeviceSelected() {
  const devices: Array<LfDevice> = state.registeredDevices;
  const lastDeviceSavedSerial: string = localStorage.getItem('lastDeviceSelectedSerial');
  const targetDevice = findDeviceByKeyValue(devices, 'serialNumber', JSON.parse(lastDeviceSavedSerial));

  let deviceSelected: LfDevice;
  if (lastDeviceSavedSerial && targetDevice) {
    const device: LfDevice = targetDevice;
    deviceSelected = device;
  } else if (devices[0]) {
    deviceSelected = devices[0] || null;
  }

  state.deviceSelected = deviceSelected;
}

export function updateSceneSelected(scene: LfScene = null, slideIndex: number) {
  log.debug('updateSceneSelected');
  let currentlyPlayingScene: LfScene;

  if (!state.experiences) {
    if (!state.playbackState.projectMetadata) {
      return;
    } else {
      state.experiences = state.playbackState.projectMetadata;
    }
  }

  if (!slideIndex && state.playbackState?.slide) {
    slideIndex = state.playbackState.slide;
  }

  const currentProjectIndex = getProjectIndex(state.playbackState.projectMetadata, state.playbackState.project);
  const currentProject = state.experiences[currentProjectIndex];

  if (!currentProject) {
    return;
  }

  if (scene) {
    currentlyPlayingScene = scene;
  } else if (state.experiences && slideIndex >= 0) {
    currentlyPlayingScene = currentProject.slides[slideIndex];
  }

  if (currentlyPlayingScene) {
    state.sceneSelected = currentlyPlayingScene;
  }
}

export function updatePlaybackState(device: LfDevice) {
  lfRemoteApiDeviceService.getPlaybackState(device.serialNumber).then(res => {
    const response = res.response;
    const json = res.body;

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

        if (project.id === projectIdActive) {
          state.projectSelectedName = project.name;
        }
      });

      state.experiences = playbackState.projectMetadata;
      state.playbackState = playbackState;
      updateSceneSelected(null, state.playbackState.slide);
    }
  }).finally(() => {
    state.deviceDataInitialized = true;
  });
}

export function resetLfAppState() {
  state.deviceSelected = null;
  state.registeredDevices = null;
  state.sceneSelected = null;
  state.experiences = null;
  state.user = null;
  state.mobileLayout = null;
  state.accountDeviceSelected = null;
  state.playbackState = null;
  state.projectSelectedName = null;
  state.deviceDataInitialized = null;
  state.appDataInitialized = null;
}


export default state as LfAppState;
