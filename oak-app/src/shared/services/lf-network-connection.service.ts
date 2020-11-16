// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
// import { WifiEntry } from "../interfaces/wifi-entry.interface";
import { LfConf } from "../../global/resources";
import { callAndroidAsync } from "./lf-android-interface.service"
import { WifiEntry } from "../interfaces/wifi-entry.interface";
import { NetworkState } from "../interfaces/network-state.interface";
import { RpcResponse } from "../interfaces/network-rpc-response.interface";

class LfNetworkConnector {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */

  public async fetchAvailableNetworks() {
    console.log("fetchAvailableNetworks");

    // Andoid API Call
    if (LfConf.device === true) {


      const androidCommand = {
        jsonrpc: '2.0',
        id: this.randToString(),
        method: 'refreshNetworkList',
        params: {}
      }

      const availableWifiNetworks = await callAndroidAsync(androidCommand)
        .then(response => (response as Body).json())
        .then(data => {
          if (data.error) {
            return Promise.reject(data.error)
          }
          return data?.result ?
            Promise.resolve(data.result) :
            Promise.reject("No available wifi networks set")
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

    // Android API Call
    if (LfConf.device === true) {
      let command = {
        jsonrpc: '2.0',
        id: this.randToString(),
        method: 'connectToNetwork',
        params: network
      }


      const connectionResponse = await callAndroidAsync(command).then(response => (response as Body).json()).then(data => {
        if (data.error) {
          return Promise.reject(data.error)
        }
        return data?.result ?
          Promise.resolve(data.result) :
          Promise.reject("No available wifi networks set")
      })
        .catch(error => {
          throw new Error(error);
        });

      return connectionResponse;

    }
    // Web API Call
    else {
      const rand = Math.floor(
        Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)
      );
      const body = {
        jsonrpc: "2.0",
        id: rand.toString(),
        method: "connectToNetwork",
        params: network,
      };

      const connectionResponse = fetch(`${LfConf.apiUrl}/rpc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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

  private randToString() {
    return Math.floor(
      Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)
    ).toString();
  }
}



export default new LfNetworkConnector();
