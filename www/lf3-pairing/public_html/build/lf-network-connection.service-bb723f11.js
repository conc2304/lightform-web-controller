let env = 'dev'; // this will get set at build time
const resources = {
  dev: {
    apiUrl: `http://192.168.1.107:8080`,
    device: false,
    dev: true,
  },
  prod: {
    apiUrl: `http://${window.location.hostname}:8080`,
    device: true,
    dev: false,
  },
  device: {
    apiUrl: null,
    device: true,
    dev: false,
  }
};
const LfConf = resources[env];

// ==== Library Imports =======================================================
class LfNetworkConnector {
  /** PUBLIC PROPERTIES------------------- */
  /** PUBLIC METHODS --------------------- */
  async getAvailableNetworks() {
    console.group("getAvailableNetworks");
    try {
      if (LfConf.device === true) {
        // Implementation of Android Interface
        //@ts-ignore
        const networksResponse = Android.availableWifiNetworks();
        const networks = JSON.parse(networksResponse);
        return networks;
      }
      if (LfConf.device === false) {
        const networks = await fetch(`${LfConf.apiUrl}/networkState`, {
          cache: "no-store",
        })
          .then(this.status)
          .then(this.json)
          .then((data) => {
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
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }
  async connectToNetwork(network) {
    console.group("connectToNetwork");
    try {
      if (LfConf.device === true) {
        const networkString = JSON.stringify(network);
        // Implementation of Android Interface
        // @ts-ignore
        Android.connectToNetwork(networkString);
      }
      else {
        const rand = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
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
          .then((response) => {
          console.log("RPC", response);
          return response.error
            ? Promise.reject("Unable to connect to network")
            : Promise.resolve(response);
        })
          .catch((error) => {
          throw new Error(error);
        });
        return connectionResponse;
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      console.groupEnd();
    }
  }
  /** PRIVATE PROPERTIES ----------------- */
  /** PRIVATE METHODS -------------------- */
  status(response) {
    console.group("status");
    try {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }
      else {
        return Promise.reject(response.statusText);
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      console.groupEnd();
    }
  }
  json(response) {
    console.group("json");
    try {
      return response.json();
    }
    catch (error) {
      console.error(error);
    }
    finally {
      console.groupEnd();
    }
  }
}
const LfNetworkConnector$1 = new LfNetworkConnector();

export { LfNetworkConnector$1 as L };
