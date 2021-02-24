// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfObjectDetails } from "../interfaces/lf-web-controller.interface";
import { LfRestResponseModel } from "./lf-rest-response";


export class LfRegisteredObjects implements LfRestResponseModel {
  // ==== PUBLIC LfRestResponseTEMP
  // ---- Properties --------------------------------------------------------

  public lfObjects: Array<LfObjectDetails> = null;

  // ---- Methods -----------------------------------------------------------

  // - -  LfRestResponse Implementation - - - - - - - - - - - - - - - - - - -
  public applyResponse(restData): void {
    if (restData) {
      this.lfObjects = restData.objects;
    }
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
}

