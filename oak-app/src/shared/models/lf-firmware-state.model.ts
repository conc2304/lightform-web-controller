// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfDeviceResponse } from "./lf-response.model";

export class LfFirmwareState implements LfDeviceResponse {

  // ==== PUBLIC LfNetworkState
  // ---- Properties --------------------------------------------------------
  public currentVersion: string = null;
  public availableVersion: string = null;
  public stagedVersion: string = null;

  public applyResponse(restData: any): void {
    if (restData) {
      this.currentVersion = restData.currentVersion || null;
      this.availableVersion = restData.availableVersion || null;
      this.stagedVersion = restData.stagedVersion || null;
    }
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
}


