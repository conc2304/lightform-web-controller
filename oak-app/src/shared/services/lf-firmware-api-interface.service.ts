// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
import LfLoggerService from "./lf-logger.service";
import { LfFirmwareState } from "../models/lf-firmware-state.model";
import { callAndroidAsync } from "./lf-android-interface.service"
import { RpcResponse } from "../interfaces/network-rpc-response.interface";
import { LfErrorResponse } from "../models/lf-error-response.model";
import { randomToString } from "./lf-utilities.service"

class LfFirmwareApiInterface {
  /** PUBLIC PROPERTIES------------------- */
  public readonly progressUpdatedEventName = 'downloadProgressUpdated';


  /** PUBLIC METHODS --------------------- */

  public registerChangeCallback() {
    this.log.debug("registerChangeCallback");
    // @ts-ignore - Android
    const response = Android.registerOtaStateChangedCallback(this.firmwareProgressUpdatedCallback);
    this.createCallback(this.firmwareProgressUpdatedCallback)
  }

  public registerProjectDownloadChangeCallback() {
    this.log.debug("registerProjectDownloadChangeCallback");
    // @ts-ignore - Android
    const response = Android.registerProjectStateChangedCallback(this.oakseedProgressUpdatedCallback);
    this.createCallback(this.oakseedProgressUpdatedCallback);
  }

  public async getFirmwareState(): Promise<LfFirmwareState> {
    this.log.debug("getFirmwareState");

    const command = {
      jsonrpc: '2.0',
      id: randomToString(),
      method: 'checkFirmwareState',
      params: {}
    }

    const firmwareState = await callAndroidAsync(command)
      .then((response: any) => JSON.parse(response))
      .then((data: RpcResponse) => {

        if (data.result) {
          const result = new LfFirmwareState();
          result.applyResponse(data.result);
          return Promise.resolve(result);
        }

        if (data.error) {
          const error = new LfErrorResponse();
          error.applyResponse(data.error);
          throw new Error(error.message);
        }

        throw new Error("Firmware State Unavailable");
      });

    return firmwareState;
  }


  public async getFirmwareErrorDetails() {
    this.log.debug("getFirmwareErrorDetails");

    const command = {
      jsonrpc: '2.0',
      id: randomToString(),
      method: 'TODO - ADD METHOD',
      params: {}
    }

    // Android API Call
    // TODO - This implementation has not been tested yet - waiting for changes to android back end
    const connectionResponse = await callAndroidAsync(command)
      .then((response: any) => JSON.parse(response))
      .then(data => {
        if (data.error) {
          return Promise.reject(data.error)
        }
        return data?.result ?
          Promise.resolve(data.result) :
          Promise.reject("No firmware error details set");
      })
      .catch(error => {
        throw new Error(error);
      });

    return connectionResponse;
  }

  public downloadFirmware() {
    this.log.debug("downloadFirmware");
    // @ts-ignore - Android
    Android.downloadFirmware();
  }

  public downloadProjects() {
    this.log.debug('downloadProjects');
    // @ts-ignore - Android
    Android.downloadProjects();
  }

  public installFirmware() {
    this.log.debug("installFirmware");
    // @ts-ignore - Android
    Android.installFirmware();
  }

  public unregisterCallback() {
    this.log.debug("unregisterCallback");
    // @ts-ignore - Android
    Android.unregisterOtaStateChangedCallback();
  }

  public unregisterProjectStateChangedCallback() {
    this.log.debug("unregisterCallback");
    // @ts-ignore - Android
    Android.unregisterProjectStateChangedCallback();
  }

  /** PRIVATE PROPERTIES ----------------- */
  private readonly firmwareProgressUpdatedCallback = `updateFirmwareProgress`;
  private readonly oakseedProgressUpdatedCallback = `updateOakseedProgress`;

  private log = new LfLoggerService('Firmware API').logger;

  /** PRIVATE METHODS -------------------- */
  private createCallback(callbackName: string) {
    this.log.debug('createCallback');
    window[callbackName] = this.progressUpdater;
  }

  private progressUpdater(downloadProgress = 0, status = true) {
    // logger service not available on the window
    console.log('Android - updateFirmwareProgress');
    console.log(downloadProgress, status);

    const event = new CustomEvent('downloadProgressUpdated', {
      detail: {
        progress: downloadProgress,
        status: status,
      },
    });
    window.dispatchEvent(event);
  };
}

export default new LfFirmwareApiInterface();
