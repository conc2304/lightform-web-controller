// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfMaskPath } from "../services/lf-remote-api/lf-remote-api-alignment.service";
import { LfRestResponseModel } from "./lf-rest-response";


export class LfOctomask implements LfRestResponseModel {
  // ==== PUBLIC LfRestResponseTEMP
  // ---- Properties --------------------------------------------------------
  public error?: string = null;
  public message?: string = null;
  public detectionBounds: LfMaskPath = null;

  // ---- Methods -----------------------------------------------------------

  // - -  LfRestResponse Implementation - - - - - - - - - - - - - - - - - - -
  public applyResponse(restData): void {
    if (restData) {
      this.detectionBounds = restData
    }
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
}

