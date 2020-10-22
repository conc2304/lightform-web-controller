// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
// import { WifiEntry } from "../interfaces/wifi-entry.interface";
import { LfConf } from "../../global/resources";
import { WifiEntry } from "../interfaces/wifi-entry.interface";
import { NetworkState } from "../interfaces/network-state.interface";
import { RpcResponse } from "../interfaces/network-rpc-response.interface";

class LfNetworkConnector {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */

  public async getAvailableNetworks() {
    console.group("getAvailableNetworks");
    try {
      const networks = await fetch(`${LfConf.apiUrl}/networkState`, {
        cache: "no-store",
      })
        .then(this.status)
        .then(this.json)
        .then((data: NetworkState) => {
          return data.availableWifiNetworks
            ? Promise.resolve(data.availableWifiNetworks)
            : Promise.reject("availableWifiNetworks is not set");
        })
        .catch((error) => {
          throw new Error(error);
        });

      return networks;
    } catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }

  public async connectToNetwork(network: WifiEntry) {
    console.group("connectToNetwork");
    try {
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
        .then(this.json)
        .then((response: RpcResponse) => {
          console.log("RPC", response);
          return response.error
            ? Promise.reject("Unable to connect to network")
            : Promise.resolve(response);
        })
        .catch((error) => {
          throw new Error(error);
        });

      return connectionResponse;
    } catch (error) {
      console.error(error);
    } finally {
      console.groupEnd();
    }
  }

  /** PRIVATE PROPERTIES ----------------- */

  /** PRIVATE METHODS -------------------- */

  private status(response) {
    console.group("status");
    try {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response.statusText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.groupEnd();
    }
  }

  private json(response) {
    console.group("json");
    try {
      return response.json();
    } catch (error) {
      console.error(error);
    } finally {
      console.groupEnd();
    }
  }
}

export default new LfNetworkConnector();
