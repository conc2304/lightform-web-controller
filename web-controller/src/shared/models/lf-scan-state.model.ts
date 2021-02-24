// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfScanStateStatus } from "../enums/lf-scan-state-status.enum";
import { LfRestResponseModel } from "./lf-rest-response";

export class LfScanState implements LfRestResponseModel {
  // ==== PUBLIC LfRestResponseTEMP
  // ---- Properties --------------------------------------------------------

  public state: LfScanStateStatus = null;
  public error: string = null;
  public percentComplete: number = null;
  public errorMessage: string = null;

  // ---- Methods -----------------------------------------------------------

  // - -  LfRestResponse Implementation - - - - - - - - - - - - - - - - - - -
  public applyResponse(restData): void {
    if (restData) {
      this.state = restData.state || null;
      this.error = restData.error || null;
      this.percentComplete = restData.percentComplete || null;
      this.errorMessage = restData.errorMessage || null;
    }
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
}


