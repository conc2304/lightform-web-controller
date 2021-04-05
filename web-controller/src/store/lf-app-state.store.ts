// ==== Library Imports =======================================================
import { createStore } from '@stencil/store';
import JsLogger from 'js-logger';
import { LfProjectType } from '../shared/enums/lf-project-type.enum';

// ==== App Imports ===========================================================
import { LfDevice, LfDevicePlaybackState, LfProjectDownloadProgress, LfProjectMetadata, LfScene, LfUser } from '../shared/interfaces/lf-web-controller.interface';
import lfAlignmentService from '../shared/services/lf-alignment.service';
import LfLoggerService from '../shared/services/lf-logger.service';
import lfRemoteApiAlignmentService from '../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfRemoteApiAuthService from '../shared/services/lf-remote-api/lf-remote-api-auth.service';
import lfRemoteApiDeviceService from '../shared/services/lf-remote-api/lf-remote-api-device.service';
import { findDeviceByKeyValue, getProjectIndex } from '../shared/services/lf-utils.service';

interface LfAppState {
  deviceSelected: LfDevice;
  registeredDevices: Array<LfDevice>;
  sceneSelected: LfScene;
  projects: Array<LfProjectMetadata>;
  user: LfUser;
  mobileLayout: boolean;
  accountDeviceSelected: LfDevice;
  playbackState: LfDevicePlaybackState;
  projectSelectedName: string;
  projectDownloadProgress: LfProjectDownloadProgress,
  projectDownloadIsPolling: boolean,
  deviceDataInitialized: boolean,
  appDataInitialized: boolean,
  appInitializing: boolean;
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
  projects: null,
  user: null,
  mobileLayout: true,
  accountDeviceSelected: null,
  playbackState: null,
  projectSelectedName: null,
  projectDownloadProgress: {},
  projectDownloadIsPolling: false,
  deviceDataInitialized: null,
  appDataInitialized: null,
  appInitializing: null,
} as LfAppState);

// onStateChange Watchers
// --------------------------------------------------------
onChange('deviceSelected', device => {
  log.info("onChange 'deviceSelected'", device);

  // Updates the playbackState and sceneSelected for the app globally
  if (device) {

    const lastDeviceSavedSerial: string = JSON.parse(localStorage.getItem('lastDeviceSelectedSerial'));

    if (lastDeviceSavedSerial && !deviceIsOffline(lastDeviceSavedSerial)) {
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

onChange('playbackState', playbackState => {
  log.info("onChange 'playbackState'", playbackState);
  const event = new CustomEvent('_playbackStateUpdated', { detail: playbackState });
  document.dispatchEvent(event);
});

onChange('projectSelectedName', projectSelectedName => {
  log.info("onChange 'projectSelectedName'", projectSelectedName);
  const event = new CustomEvent('_projectSelectedUpdated', { detail: projectSelectedName });
  document.dispatchEvent(event);
});

onChange('projectDownloadProgress', projectDownloadProgress => {
  log.info("onChange 'projectDownloadProgress'", projectDownloadProgress);
  const event = new CustomEvent('_projectDownloadProgress', { detail: projectDownloadProgress });
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

  state.appDataInitialized = false;
  state.appInitializing = true;

  await lfRemoteApiAuthService.getCurrentUser().then(async res => {
    const response = res.response;
    const json = res.body;

    if (response.status == 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      const pathRootTo = '/' + window.location.pathname.split('/')[1] || '/';

      if (!['/login', '/forgot-password', '/sign-up'].includes(pathRootTo)) {
        await customElements.whenDefined('ion-router');
        const router = document.querySelector('ion-router');
        router.push("/login");
      }
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
  } else if (devices?.length && devices[0]) {
    deviceSelected = devices[0] || null;
  }

  state.deviceSelected = deviceSelected;
  state.projectDownloadProgress = deviceSelected?._embedded?.info?.projectDownloadProgress || {};

  if (state.deviceSelected?.serialNumber && !deviceIsOffline(state.deviceSelected?.serialNumber)) {
    lfRemoteApiDeviceService.hideTestcard(state.deviceSelected.serialNumber).catch();
  }

  if (Object.keys(state.projectDownloadProgress).length && !state.projectDownloadIsPolling && state.deviceSelected?.name) {
    lfAlignmentService
      .pollProjectDownloadProgress(state.deviceSelected.name)
      .then(result => {
        log.info('pollProjectDownloadProgress', JSON.stringify(result));
        state.projectDownloadIsPolling = false;
      })
      .catch(error => {
        log.error(error);
      }).finally(() => {
        state.projectDownloadIsPolling = false;
      });
  }
  state.deviceDataInitialized = true;

}

export function updateSceneSelected(scene: LfScene = null, slideIndex: number) {
  log.debug('updateSceneSelected');
  let currentlyPlayingScene: LfScene;

  if (!state.projects) {
    if (!state.playbackState.projectMetadata) {
      return;
    } else {
      state.projects = state.playbackState.projectMetadata;
    }
  }

  if (!slideIndex && state.playbackState?.slide) {
    slideIndex = state.playbackState.slide;
  }

  const currentProjectIndex = getProjectIndex(state.playbackState.projectMetadata, state.playbackState.project);
  const currentProject = state.projects[currentProjectIndex];

  if (!currentProject) {
    return;
  }

  if (scene) {
    currentlyPlayingScene = scene;
  } else if (state.projects && slideIndex >= 0) {
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
      const playbackState = json;
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

      state.projects = playbackState.projectMetadata;
      state.playbackState = playbackState;
      updateSceneSelected(null, state.playbackState.slide);
    }
  }).finally(() => {
    state.deviceDataInitialized = true;
  });
}

export function getProjectDownloadProgress(filterFor: Array<LfProjectType> = [LfProjectType.CreatorProject, LfProjectType.EnvironmentProject, LfProjectType.ObjectsProject]): Array<number> {
  log.debug('getProjectDownloadProgress');

  const projects = state.playbackState?.projectMetadata || [];
  const projectsInProgress = state.projectDownloadProgress;
  const percentArr: Array<number> = [];

  const filteredProjects = projects.filter(project => {
    return filterFor.includes(project.type)
  });

  for (const [projectId, progressPercent] of Object.entries(projectsInProgress)) {
    filteredProjects.forEach(project => {
      if (project.id === projectId) {
        percentArr.push(progressPercent);
      }
    });
  }

  return percentArr;
}

export function deviceIsOffline(deviceSerial: string): boolean {
  log.debug('deviceIsOffline');
  if (!deviceSerial) return true;

  const devices = state.registeredDevices || [];
  const device = devices.find(device => { return device.serialNumber === deviceSerial });
  const deviceOffline = !!device?._embedded?.info?.offlineSince;

  return deviceOffline;
}

export function resetLfAppState() {
  state.deviceSelected = null;
  state.registeredDevices = null;
  state.sceneSelected = null;
  state.projects = null;
  state.user = null;
  state.mobileLayout = true;
  state.accountDeviceSelected = null;
  state.playbackState = null;
  state.projectSelectedName = null;
  state.deviceDataInitialized = null;
  state.appDataInitialized = null;
}


export default state as LfAppState;
