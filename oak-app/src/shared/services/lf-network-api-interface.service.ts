// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
// import { WifiEntry } from "../interfaces/wifi-entry.interface";
import LfLoggerService from "./lf-logger.service";
import { callAndroidAsync } from "./lf-android-interface.service"
import { WifiEntry } from "../interfaces/wifi-entry.interface";
import { RpcResponse } from "../interfaces/network-rpc-response.interface";
import { randomToString } from "./lf-utilities.service"
import { LfNetworkState } from "../models/lf-network-state.model";
import { LfNetworkConnectionResults } from "../models/lf-network-connection-results.model";
import { LfErrorResponse } from "../models/lf-error-response.model";


class LfNetworkApiInterface {
  /** PUBLIC PROPERTIES------------------- */
  /** PUBLIC METHODS --------------------- */

  public async getConnectionTestResults(): Promise<LfNetworkConnectionResults> {
    this.log.debug("getConnectionTestResults");

    const androidCommand = {
      jsonrpc: '2.0',
      id: randomToString(),
      method: 'getNetworkState',
      params: {},
    }

    return await callAndroidAsync(androidCommand)
      .then((response: any) => JSON.parse(response))
      .then((data: RpcResponse) => {

        if (data.result) {
          const result = new LfNetworkConnectionResults()
          result.applyResponse(data.result);
          return Promise.resolve(result);
        }

        if (data.error) {
          const error = new LfErrorResponse();
          error.applyResponse(data.error)
          throw new Error(error.message)
        }

        throw new Error("Network Connection Results Unavailable");
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  public async fetchNetworkState(): Promise<LfNetworkState> {
    this.log.debug("fetchNetworkState");

    // Android API Call
    const androidCommand = {
      jsonrpc: '2.0',
      id: randomToString(),
      method: 'getNetworkState',
      params: {},
    }

    return await callAndroidAsync(androidCommand)
      .then((response: any) => JSON.parse(response))
      .then((data: RpcResponse) => {

        if (data.result) {
          const result = new LfNetworkState()
          result.applyResponse(data.result);
          return Promise.resolve(result);
        }

        if (data.error) {
          const error = new LfErrorResponse();
          error.applyResponse(data.error)
          throw new Error(error.message)
        }

        throw new Error("NetworkState Unavailable");
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  public async fetchAvailableNetworks() {
    this.log.debug("fetchAvailableNetworks");

    // Android API Call
    const androidCommand = {
      jsonrpc: '2.0',
      id: randomToString(),
      method: 'refreshNetworkList',
      params: {},
    }

    const availableWifiNetworks = await callAndroidAsync(androidCommand)
      .then((response: any) => JSON.parse(response))
      .then(data => {

        if (data.error) {
          return Promise.reject(data.error);
        }

        return data?.result ?
          Promise.resolve(data.result) :
          Promise.reject("No available wifi networks set");
      })
      .catch(error => {
        throw new Error(error);
      });

    return availableWifiNetworks;
  }

  public async connectToNetwork(network: WifiEntry) {
    this.log.debug("connectToNetwork");

    const command = {
      jsonrpc: '2.0',
      id: randomToString(),
      method: 'connectToNetwork',
      params: network
    }

    // Android API Call
    const connectionResponse = await callAndroidAsync(command)
      .then((response: any) => JSON.parse(response))
      .then(data => {

        if (data.error) {
          return Promise.reject(data.error)
        }
        return data?.result ?
          Promise.resolve(data) :
          Promise.reject("No available wifi networks set")
      })
      .catch(error => {
        throw new Error(error);
      });

    this.log.debug("connectionResponse");
    this.log.debug(connectionResponse);

    return connectionResponse;

  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('Network API').logger;

  /** PRIVATE METHODS -------------------- */

  // private status(response) {
  //   if (response.status >= 200 && response.status < 300) {
  //     return Promise.resolve(response);
  //   } else {
  //     return Promise.reject(response.statusText);
  //   }
  // }

}



export default new LfNetworkApiInterface();
