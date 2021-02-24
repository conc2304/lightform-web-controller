// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfMaskPath } from "../services/lf-remote-api/lf-remote-api-alignment.service";
import { LfRestResponseModel } from "./lf-rest-response";


export class LfObjectAnalysis implements LfRestResponseModel {
  // ==== PUBLIC LfRestResponseTEMP
  // ---- Properties --------------------------------------------------------
  public error?: string = null;
  public message?: string = null;
  public detectionBounds: LfMaskPath = null;
  public alignmentCorners: LfMaskPath = null;
  public objectId?: string = null;

  // ---- Methods -----------------------------------------------------------

  // - -  LfRestResponse Implementation - - - - - - - - - - - - - - - - - - -
  public applyResponse(restData): void {
    if (restData) {
      this.error = restData.error || null;
      this.message = restData.errorMessage || restData.message || null;
      this.detectionBounds = restData.detectionBounds || null;
      this.alignmentCorners = restData.alignmentCorners || null;
      this.objectId = restData.objectId || null;
    }
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
}

