// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfDeviceResponse } from "./lf-response.model";

export class LfNetworkConnectionResults implements LfDeviceResponse {

  // ==== PUBLIC LfNetworkState
  // ---- Properties --------------------------------------------------------
  public connected: boolean = null;
  public captivePortal: boolean = null;
  public code: number = null;
  public exception?: string = null;

  public applyResponse(restData: any): void {
    if (restData) {
      this.connected = restData.connected || null;
      this.captivePortal = restData.captivePortal || null;
      this.code = restData.code || null;
      this.exception = restData.exception || null;
    }
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
}

