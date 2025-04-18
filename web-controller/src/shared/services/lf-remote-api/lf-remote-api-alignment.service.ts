// ==== Library Imports =======================================================
// none

// ==== App Imports ===========================================================
import { LfConf } from '../../../global/LfConfig';
import { LfScanStateStatus } from '../../enums/lf-scan-state-status.enum';
import { LfObjectDetails, LfRestResponse, LfRpcResponse } from '../../interfaces/lf-web-controller.interface';
import { LfImageResponse } from '../../models/lf-camera-scan-image.model';
import { LfOctomask } from '../../models/lf-environment-octomask.model';
import { LfObjectAnalysis } from '../../models/lf-object-analysis.model';
import { LfScanState } from '../../models/lf-scan-state.model';
import LfLoggerService from '../lf-logger.service';
import lfRemoteApiAuthService from './lf-remote-api-auth.service';
import lfRemoteApiRpcService from './lf-remote-api-rpc.service';


class LfRemoteApiAlignment {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */

  public async startScan(type: "object" | "environment", deviceSerial: string): Promise<LfRpcResponse> {
    this.log.debug("startScan");

    let params: LfStartScanParams;

    if (type === "object") {
      params = {
        remoteUpload: true,
        analyzeObjects: true,
        analyzeEnvironment: false,
        planarScan: true,
      };
    } else if (type === "environment") {
      params = {
        remoteUpload: true,
        analyzeObjects: false,
        analyzeEnvironment: true,
        planarScan: true,
      };
    }


    const startScanResponse = await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'startScan', params) as LfRpcResponse;
    if (startScanResponse.error) {
      throw new Error(startScanResponse.error.message);
    }
    else {
      return startScanResponse;
    }
  }

  public async cancelScan(deviceSerial: string) {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'cancelScan', null);
  }

  public async setObject(deviceSerial: string, objectId: string): Promise<LfRpcResponse> {
    this.log.debug('setObject');

    const params = {
      id: objectId,
    };

    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'setObject', params).then((response: LfRpcResponse) => {

      if (response.error) {
        this.log.warn(response.error);
        return Promise.reject(`Unable to set Lf Object ID: (${objectId}).`);
      } else {
        return Promise.resolve(response);
      }
    });
  }

  public async setObjectAlignment(deviceSerial: string, corners: LfMaskPath) {
    this.log.debug("setObjectAlignment");

    if (!corners || !deviceSerial) return;

    corners = corners.map(vector => {
      return [Math.round(vector[0]), Math.round(vector[1])];
    });

    const params = {
      projectorSpace: false,
      corners
    };

    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'setObjectAlignment', params).then((response: LfRpcResponse) => {

      if (response.error) {
        this.log.debug(response.error);
        return Promise.reject(`Unable to set Object preview alignment`);
      } else {
        return Promise.resolve(response);
      }
    });
  }

  public async oaklightOn(deviceSerial: string, mode: LfOaklightMode) {
    this.log.debug("oaklightOn");

    const params = { mode };

    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'oaklightOn', params).then((response: LfRpcResponse) => {

      if (response.error) {
        this.log.debug(response.error);
        return Promise.reject(`Unable to enable OaklightMode mode: ${mode}`);
      } else {
        return Promise.resolve(response);
      }
    });
  }

  public async oaklightOff(deviceSerial: string) {
    this.log.debug("oaklightOff");

    const params = {};

    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'oaklightOff', params).then((response: LfRpcResponse) => {

      if (response.error) {
        return Promise.reject(`Unable to disable OaklightMode`);
      } else {
        return Promise.resolve(response);
      }
    });
  }


  public async getScanImage(deviceSerialNumber: string): Promise<LfRestResponse> {
    this.log.debug("getScanImage");

    const response: Response = await lfRemoteApiAuthService.withAccessToken((token: string) =>
      fetch(`${LfConf.apiUrl}/devices/${deviceSerialNumber}/scan/sceneImage`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    const image = await response.blob();
    const model = new LfImageResponse();
    model.applyResponse(image);

    return {
      response: response,
      body: model,
    };
  }

  public async getScanImageWithMask(deviceSerialNumber: string): Promise<LfRestResponse> {
    this.log.debug("getScanImageWithMask");

    const response: Response = await lfRemoteApiAuthService.withAccessToken((token: string) =>
      fetch(`${LfConf.apiUrl}/devices/${deviceSerialNumber}/scan/sceneImageWithMask`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    const image = await response.blob();
    const model = new LfImageResponse();
    model.applyResponse(image);

    return {
      response: response,
      body: model,
    };
  }

  public async getEnvironmentAnalysis(deviceSerialNumber: string): Promise<LfRestResponse> {
    this.log.debug("getEnvironmentAnalysis");

    const response: Response = await lfRemoteApiAuthService.withAccessToken((token: string) =>
      fetch(`${LfConf.apiUrl}/devices/${deviceSerialNumber}/environmentOctomask`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    const restData = await response.json();
    const model = new LfOctomask();
    model.applyResponse(restData);

    return {
      response: response,
      body: model,
    };
  }

  public async getObjectAnalysis(deviceSerialNumber: string): Promise<LfObjectAnalysisResponse> {
    this.log.debug("getObjectAnalysis");

    const response: Response = await lfRemoteApiAuthService.withAccessToken((token: string) =>
      fetch(`${LfConf.apiUrl}/devices/${deviceSerialNumber}/scan/objectAnalysis`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    const restData = await response.json();
    const model = new LfObjectAnalysis();
    model.applyResponse(restData);

    return {
      response: response,
      body: model,
    };
  }

  public async getObjectAlignment(deviceSerialNumber: string): Promise<LfRestResponse> {
    this.log.debug("getObjectAlignment");

    const response: Response = await lfRemoteApiAuthService.withAccessToken((token: string) =>
      fetch(`${LfConf.apiUrl}/devices/${deviceSerialNumber}/alignment`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    const maskPath = await response.json();
    console.log(maskPath);

    return {
      response: response,
      body: maskPath,
    };
  }


  public async getScanState(deviceSerialNumber: string): Promise<LfScanStateResponse> {
    this.log.debug('getScanState');

    const response: Response = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(`${LfConf.apiUrl}/devices/${deviceSerialNumber}/scanState`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    const restData = await response.json();
    const model = new LfScanState();
    model.applyResponse(restData);

    return {
      response: response,
      body: model,
    };
  }

  public async getLfObjects(): Promise<LfRestResponse> {
    this.log.debug('getLfObjects');

    const response = await fetch(`${LfConf.cdnUrl}/objects/lfobjects.json`, {});

    let restData;
    try {
      restData = await response.json();
    } catch {
      restData = null;
    }

    const model = restData.objects as Array<LfObjectDetails>;
    return {
      response: response,
      body: model,
    };
  }

  public async getLfObjectOutlineImageURL(objectId: string): Promise<string> {
    this.log.debug('getLfObjectOutlineImage');

    const response = await fetch(`${LfConf.cdnUrl}/objects/${objectId}/outline.svg`, {});

    return (response.url) ? Promise.resolve(response.url) : Promise.reject();
  }


  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfRemoteApiAlignment').logger;

  /** PRIVATE METHODS -------------------- */

}



// Interfaces and Types
export interface LfScanStateRestData {
  state: LfScanStateStatus,
  error: string,
  percentComplete: number,
  errorMessage: string,
}

export interface LfObjectAnalysisResponse {
  response: Response,
  body: LfObjectAnalysis,
}

export interface LfScanStateResponse {
  response: Response,
  body: LfScanState,
}
export interface LfStartScanParams {
  hdrExposures?: number,
  applyMask?: boolean,
  fastScan?: boolean,
  fillPixels?: number,
  captureExposure?: number,
  captureWhiteBalance?: number,
  captureDisplayBrightness?: number,
  safeMode?: boolean,
  realignment?: boolean,
  debug?: boolean,
  cameraMask?: LfLivelightVectorScene,
  projectorMask?: LfLivelightVectorScene,
  mageOnlyScan?: boolean,
  planarScan?: boolean,
  remoteUpload?: boolean
  useExisting?: boolean,
  analyzeObjects: boolean,
  analyzeEnvironment: boolean,
}

export interface LfLivelightVectorScene {
  masks: Array<LfLivelightVectorMask>,
}
export interface LfLivelightVectorMask {
  paths: Array<LfLivelightVectorMask>,
  fillColor: string | number,
  strokeColor: string | number,
  strokeWidth: number,
}

export interface LfScanDataObject {
  scanImageUrl: string;
  objectAnalysis: LfObjectAnalysis;
}

export enum LfOaklightMode {
  EnvironmentOctomask = 'EnvironmentOctomask',
  ObjectAlignment = 'ObjectAlignment',
  Perspective = 'Perspective',
}


export type LfMaskPath = Array<LfMaskPoint>;

export type LfMaskPoint = Array<number>;

export default new LfRemoteApiAlignment();



// NOTE
// tl;dr pass "projectorSpace": false as another json key/value for the following method parameters:
// getObjectAlignment
// setObjectAlignment
// getEnvironmentOctomask
// setEnvironmentOctomask
// getPerspective
// setPerspective
