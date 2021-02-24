// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfRestResponseModel } from "./lf-rest-response";


export class LfImageResponse implements LfRestResponseModel {
  // ==== PUBLIC LfRestResponseTEMP
  // ---- Properties --------------------------------------------------------

  public error: string = null;
  public message: string = null;
  public imgUrl?: string = null;

  // ---- Methods -----------------------------------------------------------

  // - -  LfRestResponse Implementation - - - - - - - - - - - - - - - - - - -
  public applyResponse(restData): void {
    if (restData) {
      this.error = restData.error || null;
      this.message = restData.errorMessage || restData.message || null;

      if (restData instanceof Blob) {
        this.imgUrl = URL.createObjectURL(restData) || null;
      }
    }
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
}

