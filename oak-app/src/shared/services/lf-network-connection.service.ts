// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
// import { WifiEntry } from "../interfaces/wifi-entry.interface";
import { LfConf } from "../../global/resources";
import { callAndroidAsync } from "./lf-android-interface.service"
import { WifiEntry } from "../interfaces/wifi-entry.interface";
import { NetworkState } from "../interfaces/network-state.interface";
import { RpcResponse } from "../interfaces/network-rpc-response.interface";
import { randomToString } from "./lf-utilities.service"


class LfNetworkConnector {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */

  public async fetchAvailableNetworks() {
    console.log("fetchAvailableNetworks");

    // Android API Call
    if (LfConf.device === true) {
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
    // Web Call
    else {
      const networks = await fetch(`${LfConf.apiUrl}/networkState`, {
        cache: "no-store",
      })
        .then(this.status)
        .then(response => response.json())
        .then((data: NetworkState) => {

          return data.availableWifiNetworks
            ? Promise.resolve(data.availableWifiNetworks)
            : Promise.reject("availableWifiNetworks is not set");
        })
        .catch((error) => {
          throw new Error(error);
        });

      return networks;
    }
  }

  public async connectToNetwork(network: WifiEntry) {
    console.log("connectToNetwork");

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

      console.log("connectionResponse");
      console.log(connectionResponse);

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
          console.log("RPC", response);

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

  /** PRIVATE METHODS -------------------- */

  private status(response) {
    console.log("status");
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response.statusText);
    }
  }

  private json(response) {
    console.log("json");
    console.log(response);

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
      console.log("isJsonString");
      try {
        JSON.parse(str)
      } catch (e) {
        return false;
      }
      return true;
    }
  }


}



export default new LfNetworkConnector();
