// ==== Library Imports =======================================================
// none
// ==== App Imports ===========================================================
import { LfConf } from "../../../global/LfConfig";
import LfLoggerService from "../lf-logger.service";
import lfRemoteApiAuthService from "./lf-remote-api-auth.service";
import lfRemoteApiRpcService from "./lf-remote-api-rpc.service";

export interface SetContentParams {
  deviceSerial: string, projectId: string, slide: number | string, hdmiIndex: number,
}

class LfDeviceApiService {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */
  public async getDevices(embedInfo: boolean) {
    this.log.debug("getDevices");

    var embed = '';
    if (embedInfo) {
      embed = '?embed=info';
    }
    const response = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(LfConf.apiUrl + '/devices' + embed, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    );

    return {
      response: response,
      body: await response.json()
    };
  }

  public async getDeviceInfo(deviceName: string) {
    this.log.debug("getDeviceInfo");

    const response = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(`${LfConf.apiUrl}/devices/${deviceName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    );

    return {
      response: response,
      body: await response.json()
    };
  }

  public async getPlaybackState(deviceSerial: string = "") {
    this.log.debug("getPlaybackState");

    const response = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(`${LfConf.apiUrl}/devices/${deviceSerial}/playbackState`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    );

    return {
      response: response,
      body: await response.json()
    };
  }

  public async setContent({ deviceSerial, projectId, slide, hdmiIndex = null }: SetContentParams ) {
    this.log.debug("setContent");

    let contentUri: string;
    if (projectId && slide) {
      contentUri = `project:${projectId}#${slide}`;
    } else if (hdmiIndex !== null) {
      contentUri = `hdmi:${hdmiIndex}`;
    }
    const params = contentUri;

    return lfRemoteApiRpcService.rpcRequest(deviceSerial, "setContent", params);
  }

  public async setSlideIndex(deviceSerial: string, slideIndex: number) {
    this.log.debug("setSlideIndex")

    const params = {
      index: slideIndex
    };

    return lfRemoteApiRpcService.rpcRequest(deviceSerial, "setSlideIndex", params);
  }

  public async getDeviceSceneInfo(deviceName: string) {
    this.log.debug("getDeviceSceneInfo");

    const response = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(`${LfConf.apiUrl}/devices/${deviceName}/slideParameters`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    );

    return {
      response: response,
      body: await response.json()
    };
  }



  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfDeviceApiService').logger;

  /** PRIVATE METHODS -------------------- */
}

export default new LfDeviceApiService();
