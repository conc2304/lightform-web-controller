// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfDeviceResponse } from "./lf-response.model";

export class LfErrorResponse implements LfDeviceResponse {

  // ==== PUBLIC LfNetworkState
  // ---- Properties --------------------------------------------------------
  public code: number = null;
  public message: string = null;
  public data?: any = null;

  public applyResponse(restData: any): void {
    if (restData) {
      this.code = restData.code || null;
      this.message = restData.message || null;
      this.data = restData.data || null;
    }
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
}


