// ==== Library Imports =======================================================
// none

// ==== App Imports ===========================================================
import { LfConf } from '../../../global/LfConfig';
import { LfRestResponse } from '../../interfaces/lf-web-controller.interface';
import { LfDeviceInfo } from '../../models/lf-device-info.model';
import LfLoggerService from '../lf-logger.service';
import lfRemoteApiAuthService from './lf-remote-api-auth.service';
import lfRemoteApiRpcService from './lf-remote-api-rpc.service';

export interface SetContentParams {
  deviceSerial: string;
  projectId: string;
  slideIndex: number | string;
  hdmiIndex: number;
}

class LfDeviceApiService {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */
  public async getDevices(embedInfo: boolean) {
    this.log.debug('getDevices');

    var embed = '';
    if (embedInfo) {
      embed = '?embed=info';
    }
    const response = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(LfConf.apiUrl + '/devices' + embed, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    return {
      response: response,
      body: await response.json(),
    };
  }


  public async getDeviceInfo(deviceName: string): Promise<DeviceInfoResponse> {
    this.log.debug('getDeviceInfo');

    const response = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(`${LfConf.apiUrl}/devices/${deviceName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    const restData = await response.json();
    const model = new LfDeviceInfo();
    model.applyResponse(restData);

    return {
      response: response,
      body: model,
    };
  }

  public async getPlaybackState(deviceSerial: string = '') {
    this.log.debug('getPlaybackState');

    const response = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(`${LfConf.apiUrl}/devices/${deviceSerial}/playbackState`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    return {
      response: response,
      body: await response.json(),
    };
  }

  public async setContent({ deviceSerial, projectId, slideIndex, hdmiIndex = null }: SetContentParams) {
    this.log.debug('setContent');

    let contentUri: string;
    if (projectId && slideIndex !== null) {
      contentUri = `project:${projectId}#${slideIndex}`;
    } else if (hdmiIndex !== null) {
      contentUri = `hdmi:${hdmiIndex}`;
    }
    const params = contentUri;

    return lfRemoteApiRpcService.rpcRequest(deviceSerial, 'setContent', params);
  }

  public async setSlideIndex(deviceSerial: string, slideIndex: number) {
    this.log.debug('setSlideIndex');

    const params = {
      index: slideIndex,
    };

    return lfRemoteApiRpcService.rpcRequest(deviceSerial, 'setSlideIndex', params);
  }

  public async getDeviceSceneInfo(deviceName: string) {
    this.log.debug('getDeviceSceneInfo');

    const response = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(`${LfConf.apiUrl}/devices/${deviceName}/slideParameters`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    return {
      response: response,
      body: await response.json(),
    };
  }

  public async deregisterDevice(deviceSerial: string) {
    this.log.debug('deregisterDevice');

    const response = await fetch(`${LfConf.apiUrl}/devices/${deviceSerial}`, {
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return response;
  }

  public async depublishProject(deviceSerial:string, projectId:string): Promise<LfRestResponse>{

    const response = await fetch(`${LfConf.apiUrl}/devices/${deviceSerial}/publishes/${projectId}`, {
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return {
      response: response,
      body: await response.json(),
    };
  }

  // Device PlayBlack Controls
  // ---------------------------------------
  public async play(deviceSerial: string): Promise<void> {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'play', null);
  }

  public async pause(deviceSerial: string): Promise<void> {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'pause', null);
  }

  public async stop(deviceSerial: string): Promise<void> {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'stop', null);
  }

  public async next(deviceSerial: string): Promise<void> {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'nextSlide', null);
  }

  public async previous(deviceSerial: string): Promise<void> {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'prevSlide', null);
  }

  public async updateBrightness(deviceSerial: string, brightness: number) {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'setGlobalBrightness', { brightness: Number(brightness) });
  }

  public async updateVolume(deviceSerial: string, volumeLevel: number) {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'setGlobalVolume', Number(volumeLevel));
  }

  public async lightEngineOff(deviceSerial: string) {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'turnProjectorOff', null);
  }

  public async lightEngineOn(deviceSerial: string) {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'turnProjectorOn', null);
  }

  public async hideTestcard(deviceSerial: string) {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'hideTestcard', null);
  }

  public async showTestcard(deviceSerial: string) {
    return await lfRemoteApiRpcService.rpcRequest(deviceSerial, 'showTestcard', { "mode": "dark" });
  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfDeviceApiService').logger;

  /** PRIVATE METHODS -------------------- */
}

export default new LfDeviceApiService();


interface DeviceInfoResponse {
  response: Response,
  body: LfDeviceInfo
}
