// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
import { LfConf } from "../../global/resources";
import { callAndroidAsync } from "./lf-android-interface.service"
import LfLoggerService from "./lf-logger.service";
import { randomToString } from "./lf-utilities.service"

class LfFirmwareApiInterface {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */

  public registerChangeCallback() {
    this.log.debug("registerChangeCallback");
    // @ts-ignore - Android
    const response = Android.registerOtaStateChangedCallback(this.progressUpdatedCallback);
    this.createCallback()
  }


  public getFirmwareState() {
    this.log.debug("getFirmwareState");
    // @ts-ignore - Android
    const response = Android.firmwareState();
    const fwState = JSON.parse(response);

    return fwState;
  }

  public downloadFirmware() {
    this.log.debug("downloadFirmware");
    // @ts-ignore - Android
    Android.downloadFirmware();
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

  public async getFirmwareErrorDetails() {
    this.log.debug("getFirmwareErrorDetails");

    const command = {
      jsonrpc: '2.0',
      id: randomToString(),
      method: 'TODO - ADD METHOD',
      params: {}
    }

    // Android API Call
    if (LfConf.device === true) {
      // TODO - This implementation has not been tested yet - waiting for changes to android back end
      const connectionResponse = await callAndroidAsync(command)
        .then((response: any) => response.json())
        .then(data => {
          if (data.error) {
            return Promise.reject(data.error)
          }
          return data?.result ?
            Promise.resolve(data.result) :
            Promise.reject("No firmware error details set")
        })
        .catch(error => {
          throw new Error(error);
        });

      return connectionResponse;
    }
  }

  /** PRIVATE PROPERTIES ----------------- */
  private readonly progressUpdatedCallback = `updateFirmwareProgress`;
  private log = new LfLoggerService('Firmware API').logger;

  /** PRIVATE METHODS -------------------- */
  private createCallback() {
    this.log.debug('createCallback');

    window[this.progressUpdatedCallback] = this.progressUpdater;
  }

  private progressUpdater(downloadProgress = 0, status = true) {
    // logger service not available on the window
    console.log('Android - updateFirmwareProgress');
    console.log(downloadProgress, status);

    const event = new CustomEvent('firmwareDownloadProgress', {
      detail: {
        progress: downloadProgress,
        status: status,
      },
    });
    window.dispatchEvent(event);
  };
}

export default new LfFirmwareApiInterface();
