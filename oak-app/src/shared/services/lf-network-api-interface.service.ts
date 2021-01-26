// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
// import { WifiEntry } from "../interfaces/wifi-entry.interface";
import LfLoggerService from "./lf-logger.service";
import { LfConf } from "../../global/resources";
import { callAndroidAsync } from "./lf-android-interface.service"
import { WifiEntry } from "../interfaces/wifi-entry.interface";
import { RpcResponse } from "../interfaces/network-rpc-response.interface";
import { randomToString } from "./lf-utilities.service"
import { LfNetworkState } from "../models/lf-network-state.model";
import { LfErrorResponse } from "../models/lf-error-response.model";


class LfNetworkApiInterface {
  /** PUBLIC PROPERTIES------------------- */
  /** PUBLIC METHODS --------------------- */

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
      .then((response: any) => response.json())
      .then((data: RpcResponse) => {
        this.log.info(data);

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
      .then(this.json)
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
    if (LfConf.device === true) {
      const connectionResponse = await callAndroidAsync(command)
        .then(this.json)
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
    // Web API Call
    else {
      const connectionResponse = fetch(`${LfConf.apiUrl}/rpc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
        cache: "no-store",
      })
        .then(this.status)
        .then(response => response.json())
        .then((response: RpcResponse) => {
          this.log.debug("RPC", response);

          return (!response || response.error)
            ? Promise.reject("Unable to connect to network")
            : Promise.resolve(response);
        })
        .catch((error) => {
          throw new Error(error);
        });

      return connectionResponse;
    }
  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('Network API').logger;

  /** PRIVATE METHODS -------------------- */

  private status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response.statusText);
    }
  }

  private json(response) {
    try {
      let responseParsed;

      if (isJsonString(response)) {
        responseParsed = JSON.parse(response);
        if (responseParsed.result && isJsonString(responseParsed.result)) {
          responseParsed.result = JSON.parse(responseParsed.result);
        }
      }

      return (responseParsed) ? responseParsed : response;
    } catch (error) {
      return response;
    }

    function isJsonString(str: string) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false;
      }
      return true;
    }
  }


}



export default new LfNetworkApiInterface();
