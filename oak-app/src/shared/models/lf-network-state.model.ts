// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { WifiEntry } from "../interfaces/wifi-entry.interface";
import LfLoggerService from "../services/lf-logger.service";
import { LfDeviceResponse } from "./lf-response.model";

export class LfNetworkState implements LfDeviceResponse {

  // ==== PUBLIC LfNetworkState
  // ---- Properties --------------------------------------------------------
  public ip: string = null;
  public activeInterface: LfActiveInterface = null;
  public mode: LfDeviceNetworkMode = null;
  public activeSSID: string = null;
  public knownNetworks: Array<WifiEntry> = null;
  public availableNetworks: Array<WifiEntry> = null;

  public applyResponse(restData: any): void {
    this.log.debug("applyResponse");

    if (restData) {
      this.ip = restData.ip || null;
      this.activeInterface = restData.activeInterface || null;
      this.mode = restData.mode || null;
      this.activeSSID = restData.activeSSID || null;
      this.knownNetworks = restData.knownNetworks || null;
      this.availableNetworks = restData.availableNetworks || null;
    }
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
  private log = new LfLoggerService('LfNetworkState Model').logger;
}

export type LfActiveInterface = "wifi" | "eth";
export type LfDeviceNetworkMode = "connected_with_ip" | "pairing" | "trying_connection" | "init";

