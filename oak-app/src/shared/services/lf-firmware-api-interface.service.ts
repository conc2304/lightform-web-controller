// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
// import { WifiEntry } from "../interfaces/wifi-entry.interface";
import { LfConf } from "../../global/resources";
import { callAndroidAsync } from "./lf-android-interface.service"
import { randomToString } from "./lf-utilities.service"

class LfFirmwareApiInterface {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */

  public registerChangeCallback() {
    console.log("registerChangeCallback")
    // @ts-ignore - Android
    const response = Android.registerOtaStateChangedCallback(this.progressUpdatedCallback);
    this.createCallback()
    console.log(response);



    // return register;
  }


  public getFirmwareState() {
    // @ts-ignore - Android
    const response = Android.firmwareState();
    const fwState = JSON.parse(response);

    return fwState;
  }

  public downloadFirmware() {
    // @ts-ignore - Android
    const response = Android.downloadFirmware();

    return response;
  }

  public installFirmware() {
    // @ts-ignore - Android
    const response = Android.installFirmware();

    return response;
  }

  public unregisterCallback() {
    // @ts-ignore - Android
    const unregister = Android.registerOtaStateChangedCallback(this.progressUpdatedCallback);
    return unregister;
  }


  // public async getDeviceFirmwareInfo() {
  //   console.log("getDeviceFirmwareInfo");

  //   // Android API Call
  //   if (LfConf.device === true) {
  //     // TODO - This implementation has not been tested yet - waiting for changes to android back end
  //     const androidCommand = {
  //       jsonrpc: '2.0',
  //       id: randomToString(),
  //       method: 'TODO - ADD METHOD',
  //       params: {},
  //     }

  //     const firmwareInfo = await callAndroidAsync(androidCommand)
  //       .then((response: Body) => response.json())
  //       .then(data => {
  //         if (data.error) {
  //           return Promise.reject(data.error);
  //         }
  //         return data?.result ?
  //           Promise.resolve(data.result) :
  //           Promise.reject("No available firmware info");
  //       })
  //       .catch(error => {
  //         throw new Error(error);
  //       });

  //     return firmwareInfo;
  //   }
  // }

  public async getFirmwareErrorDetails() {
    console.log("getFirmwareErrorDetails");

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
        .then((response: Body) => response.json())
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

  public async restartFirmwareDownload() {
    console.log("restartFirmwareDownload");

    const command = {
      jsonrpc: '2.0',
      id: randomToString(),
      method: 'TODO - ADD METHOD',
      params: {}
    }

    // Android API Call
    // TODO - This implementation has not been tested yet - waiting for changes to android back end
    const connectionResponse = await callAndroidAsync(command)
      .then((response: Body) => response.json())
      .then(data => {
        if (data.error) {
          return Promise.reject(data.error)
        }
        return data?.result ?
          Promise.resolve(data.result) :
          Promise.reject("Unable to restart firmware update");
      })
      .catch(error => {
        throw new Error(error);
      });

    return connectionResponse;
  }

  /** PRIVATE PROPERTIES ----------------- */
  private readonly progressUpdatedCallback = `updateFirmwareProgress`;

  /** PRIVATE METHODS -------------------- */
  private createCallback() {
    window[this.progressUpdatedCallback] = function(downloadProgress = 0, status = true) {
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
}

export default new LfFirmwareApiInterface();
