// ==== Library Imports =======================================================
// none

// ==== App Imports ===========================================================
import { LfEnvironmentAlignmentMode } from '../../components/pages/page-scene-setup/lf-environment-alignment-mode.enum';
import lfAlignmentStateStore from '../../store/lf-alignment-state.store';
import lfAppStateStore from '../../store/lf-app-state.store';
import { LF_COORD_RANGE, SCAN_IMG_DIMENSIONS } from '../constants/lf-alignment.constant';
import { LfScanStateStatus } from '../enums/lf-scan-state-status.enum';
import { LfProjectDownloadProgress, LfRestResponse } from '../interfaces/lf-web-controller.interface';
import { LfImageResponse } from '../models/lf-camera-scan-image.model';
import { LfObjectAnalysis } from '../models/lf-object-analysis.model';
import { LfScanState } from '../models/lf-scan-state.model';
import LfLoggerService from './lf-logger.service';
import lfPollingService from './lf-polling.service';
import lfRemoteApiAlignmentService, { LfMaskPath, LfOaklightMode, LfScanDataObject } from './lf-remote-api/lf-remote-api-alignment.service';
import lfRemoteApiDeviceService from './lf-remote-api/lf-remote-api-device.service';
import { mapValue } from './lf-utils.service';

class LfAlignmentService {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */
  public async setOutlineImgUrl(objectId: string) {
    const url: string = await lfRemoteApiAlignmentService.getLfObjectOutlineImageURL(objectId);

    if (!!url) {
      lfAlignmentStateStore.lfObjectOutlineImgUrl = url;
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }

  public async checkScanStatus(deviceSerial: string) {
    this.log.debug('checkScanStatus');

    const validate = (response: LfRestResponse) => response?.body?.state === LfScanStateStatus.Finished;
    const failedCheck = response => {
      const scanStateHasError = (response: LfRestResponse) => {
        const scanStateResponse = response?.body as LfScanState;
        const error = scanStateResponse.error && scanStateResponse.error.toLowerCase() !== 'none';
        const errorMessage = scanStateResponse.errorMessage !== null;
        return error || errorMessage;
      };
      const hasScanError = scanStateHasError(response);
      return !response?.response.ok || hasScanError;
    };

    const fn = lfRemoteApiAlignmentService.getScanState;
    const fnArgs = deviceSerial;

    return lfPollingService
      .poll(fn, [fnArgs], validate, 5, 1.5, failedCheck)
      .then((response: LfRestResponse) => {
        return response.body as LfScanState
      })
      .catch(error => {
        this.log.error(error);
        return Promise.reject(error)
      });
  }

  public async getObjectScanData(deviceSerial: string): Promise<LfScanDataObject> {
    this.log.debug('getDeviceScanData');

    return await Promise.all([this.getCameraImage(deviceSerial), this.getObjectAlignment(deviceSerial)])
      .then(results => {
        const resultsObject = {
          scanImageUrl: results[0].imgUrl || null,
          objectAnalysis: results[1] || null,
        };
        return Promise.resolve(resultsObject);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }


  public async getCameraImage(deviceSerial: string): Promise<LfImageResponse> {
    this.log.debug('getCameraImage');

    return lfRemoteApiAlignmentService.getScanImage(deviceSerial).then(response => {
      if (!response.response.ok || response.body.error) {
        const errorMessage = `Unable to get color camera image for ${lfAppStateStore.deviceSelected.name}.  Error: ${response.body.error || 'N/A'}`;
        return Promise.reject(errorMessage);
      } else {
        return Promise.resolve(response.body);
      }
    });
  }

  public async getCameraImageMasked(deviceSerial: string): Promise<LfImageResponse> {
    this.log.debug('getCameraImage');

    return lfRemoteApiAlignmentService.getScanImageWithMask(deviceSerial).then(response => {
      if (!response.response.ok || response.body.error) {
        const errorMessage = `Unable to get masked camera image for ${lfAppStateStore.deviceSelected.name}.  Error: ${response.body.error || 'N/A'}`;
        return Promise.reject(errorMessage);
      } else {
        return Promise.resolve(response.body);
      }
    });
  }

  public async getObjectAlignment(deviceSerial: string): Promise<LfObjectAnalysis> {
    this.log.debug('getObjectAlignment');

    return lfRemoteApiAlignmentService.getObjectAnalysis(deviceSerial).then(response => {
      if (!response.response.ok) {
        const errorMessage = `Unable to get object analysis for ${lfAppStateStore.deviceSelected.name}.  Error: ${response.body.error || 'N/A'}`;
        return Promise.reject(errorMessage);
      } else {
        return Promise.resolve(response.body);
      }
    });
  }

  public async getEnvironmentAlignment(deviceSerial: string): Promise<LfObjectAnalysis> {
    this.log.debug('getObjectAlignment');

    return lfRemoteApiAlignmentService.getEnvironmentAnalysis(deviceSerial).then(response => {
      if (!response.response.ok) {
        const errorMessage = `Unable to get environment analysis for ${lfAppStateStore.deviceSelected.name}.  Error: ${response.body.error || 'N/A'}`;
        return Promise.reject(errorMessage);
      } else {
        return Promise.resolve(response.body);
      }
    });
  }


  public async triggerObjectAlignment(deviceSerial: string, objectId: string, oaklightMode: LfOaklightMode, objectPath: LfMaskPath): Promise<LfAlignmentProcessStatus> {
    this.log.debug('triggerObjectAlignment');

    let alignmentStatus: LfAlignmentProcessStatus = {
      setObject: null,
      preview: null,
      outline: null,
      alignment: null,
    };

    await lfRemoteApiAlignmentService
      .setObject(deviceSerial, objectId)
      .then(response => {
        // some sort of error handling maybe
        if (!response.result) {
          Promise.reject('Set Object was unsuccessful')
        }
        alignmentStatus.setObject = true;
      })
      .catch(() => {
        lfRemoteApiAlignmentService.oaklightOff(deviceSerial).then().catch();
        alignmentStatus.setObject = false;
      });

    if (!alignmentStatus.setObject) {
      return alignmentStatus;
    }

    await lfRemoteApiAlignmentService.oaklightOn(deviceSerial, oaklightMode).then(() => {
      alignmentStatus.preview = true;
    }).catch(e => {
      console.error(e);
      alignmentStatus.preview = false;
    });


    if (!alignmentStatus.preview) {
      return alignmentStatus;
    }

    await this.setOutlineImgUrl(objectId).then(async () => {
      let cornerPoints: LfMaskPath;

      if (!objectPath) {
        console.warn('objectPath', 'no');
        cornerPoints = getDefaultCorners();
      } else {
        console.warn('objectPath', 'yes');
        cornerPoints = objectPath
      }

      console.log(cornerPoints);

      alignmentStatus.outline = true;
      await lfRemoteApiAlignmentService.setObjectAlignment(deviceSerial, cornerPoints).then(() => {
        alignmentStatus.alignment = true;
      }).catch(() => {
        alignmentStatus.alignment = false;
      });
    }).catch(error => {
      alignmentStatus.outline = false;
      alignmentStatus.alignment = false;
      this.log.error(error);
    });

    return alignmentStatus;

    function getDefaultCorners(): LfMaskPath {
      const maxH = SCAN_IMG_DIMENSIONS.height / (SCAN_IMG_DIMENSIONS.width / LF_COORD_RANGE.max);
      const size = 0.1;

      const imageWidth = Math.round(LF_COORD_RANGE.max * size);
      const paddingW = LF_COORD_RANGE.max - imageWidth;
      const imageHeight = Math.round(maxH * size);
      const paddingH = maxH - imageHeight;

      let vecTL, vecTR, vecBR, vecBL;
      vecTL = [LF_COORD_RANGE.max - paddingW, maxH - paddingH];
      vecTR = [paddingW, maxH - paddingH];
      vecBR = [paddingW, paddingH];
      vecBL = [LF_COORD_RANGE.max - paddingW, paddingH];
      let cornerPoints = [vecTL, vecTR, vecBR, vecBL];
      return cornerPoints;
    }
  }

  public getOaklightMode(): LfOaklightMode {
    switch (lfAlignmentStateStore.scanType) {
      case 'object':
        return LfOaklightMode.ObjectAlignment;
      case 'environment':
        return LfOaklightMode.EnvironmentOctomask;
    }
  }

  public sceneWasFound(): boolean {
    return !!lfAlignmentStateStore.lfObjectName
  }

  public p5PointToLfValue(p5Value: number, plane: 'x' | 'y', canvasSize: { width: number, height: number }): number {
    if (!plane || !['x', 'y'].includes(plane)) return;
    const dimension: 'width' | 'height' = plane === 'x' ? 'width' : 'height';
    const absCanvas = canvasSize[dimension] / 2;

    const mappedVal = mapValue(p5Value, -absCanvas, absCanvas, LF_COORD_RANGE.min, LF_COORD_RANGE.max)
    return Math.round(mappedVal);
  }

  public lfPointToP5Value(value: number, plane: 'x' | 'y', canvasSize: { width: number, height: number }): number {
    if (!plane || !['x', 'y'].includes(plane)) return;
    const dimension: 'width' | 'height' = plane === 'x' ? 'width' : 'height';

    const absCanvas = canvasSize[dimension] / 2;
    const canvasMin = (plane === "x") ? -absCanvas : absCanvas;
    const canvasMax = (plane === "x") ? absCanvas : -absCanvas;


    const mappedVal = mapValue(value, LF_COORD_RANGE.min, LF_COORD_RANGE.max, canvasMin, canvasMax);
    return (plane === "x") ? mappedVal : -mappedVal;
  }

  public async handlePermission(permissionName: any): Promise<string> {
    return navigator.permissions.query({ name: permissionName }).then(function (result) {
      return Promise.resolve(result.state)
    });
  }

  public getActionButtonLabel(): { leftButtonLabel: string; rightButtonLabel: string } {
    const alignmentFound = !!(lfAlignmentStateStore.objectAnalysis?.alignmentCorners || lfAlignmentStateStore.objectAnalysis?.detectionBounds);
    let lfAlignmentSuccess: boolean;

    if (lfAlignmentStateStore.scanType === 'object') {
      lfAlignmentSuccess = !!alignmentFound && !!lfAlignmentStateStore.lfObjectName;
    } else if (lfAlignmentStateStore.scanType === 'environment') {
      lfAlignmentSuccess = !!lfAlignmentStateStore.scanImageUrl && !!lfAlignmentStateStore.lfObjectName;
    }

    if (lfAlignmentStateStore.scanType === 'object') {
      if (lfAlignmentSuccess) {
        return {
          leftButtonLabel: 'Edit Alignment',
          rightButtonLabel: 'Finish',
        };
      } else {
        return {
          leftButtonLabel: 'Manual Setup',
          rightButtonLabel: 'Rescan',
        };
      }
    }
    // end object
    else if (lfAlignmentStateStore.scanType === 'environment') {
      if (lfAlignmentSuccess) {
        return {
          leftButtonLabel: 'Custom Mask',
          rightButtonLabel: 'Finish',
        };
      } else {
        return {
          leftButtonLabel: 'Manual Setup',
          rightButtonLabel: 'Rescan',
        };
      }
    } else {
      return {
        leftButtonLabel: '',
        rightButtonLabel: '',
      };
    }
  }

  public getAlignmentViewTitle(alignmentMode: 'pending' | 'edit', environmentMode: LfEnvironmentAlignmentMode): string {
    this.log.debug('getAlignmentViewTitle');

    const appState = lfAlignmentStateStore;
    let title: string;
    let sceneName: string;

    if (environmentMode !== null) {
      if (environmentMode === LfEnvironmentAlignmentMode.Feathering) return 'Feathering';
      if (environmentMode === LfEnvironmentAlignmentMode.Perspective) return 'Perspective';
    }
    else if (alignmentMode === 'edit') {
      return appState.scanType === 'object' ? 'Edit Alignment' : 'Create custom mask';
    } else {
      if (appState.scanType === 'object') {
        sceneName = appState.lfObjectName || 'No Object';
      } else if (appState.scanType === 'environment') {
        sceneName = appState.lfObjectName || 'No wall space';
      }
      title = `${sceneName} found`;
    }

    return title;
  }

  public async getDeviceProjectDownloadProgress(deviceName: string): Promise<LfProjectDownloadProgress> {
    // get the device info to check for download progress
    return lfRemoteApiDeviceService.getDeviceInfo(deviceName).then(res => {
      const response = res.response;
      const deviceInfoResponse = res.body;

      if (deviceInfoResponse?._embedded?.info?.projectDownloadProgress) {
        lfAppStateStore.projectDownloadProgress = deviceInfoResponse._embedded.info.projectDownloadProgress
        return Promise.resolve(lfAppStateStore.projectDownloadProgress);
      } else if (!response.ok) {
        let errorMsg = `Unable to retrieve device info for ${deviceName}.`;
        if (deviceInfoResponse.message || deviceInfoResponse.error) {
          errorMsg += `Error: ${deviceInfoResponse.message || deviceInfoResponse.error}`;
        }
        return Promise.reject(errorMsg);
      }
      if (!deviceInfoResponse?._embedded?.info?.projectDownloadProgress) {
        return Promise.reject('Device has no project downloading');
      } else {
        return Promise.reject('Unable to get project download progress');
      }
    });
  }

  public async pollProjectDownloadProgress(deviceName: string) {
    lfAppStateStore.projectDownloadIsPolling = true;
    const validate = (projectsDownloading: LfProjectDownloadProgress) => {
      const hasCompleted = (progressValue: number) => progressValue === 0 || progressValue >= 100 || progressValue === null;
      return Object.keys(projectsDownloading).length === 0 || Object.values(projectsDownloading).every(hasCompleted);
    }
    const failedCheck = null; // no failed check

    const fn = this.getDeviceProjectDownloadProgress;
    const fnArgs = deviceName;

    return lfPollingService
      .poll(fn, [fnArgs], validate, 2, 5, failedCheck)
      .then((response: LfRestResponse) => {
        return response.body as LfScanState
      })
      .catch(error => {
        this.log.error(error);
        return Promise.reject(error)
      }).finally(() => {
        lfAppStateStore.projectDownloadIsPolling = false;
      });
  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfAlignmentService').logger;

  /** PRIVATE METHODS -------------------- */
}

interface LfAlignmentProcessStatus {
  setObject: boolean
  preview: boolean,
  outline: boolean,
  alignment: boolean
};

export default new LfAlignmentService();
