// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfDeviceProps } from '../interfaces/lf-web-controller.interface';
import { LfRestResponseModel } from "./lf-rest-response";

export class LfDeviceInfo implements LfRestResponseModel {
  // ==== PUBLIC LfRestResponseTEMP
  // ---- Properties --------------------------------------------------------

  public error?: string = null;
  public message?: string = null;

  public name: string = null;
  public serialNumber: string = null;
  public createdAt: string = null;
  public owner: string = null;
  public model?: string = null;
  public _embedded?: { info: LfDeviceProps; } = null;


  // ---- Methods -----------------------------------------------------------

  // - -  LfRestResponse Implementation - - - - - - - - - - - - - - - - - - -
  public applyResponse(restData): void {
    if (restData) {
      this.error = restData.error || null;
      this.message = restData.errorMessage || restData.message || null;

      this.name = restData.name || null;
      this.serialNumber = restData.serialNumber || null;
      this.createdAt = restData.createdAt || null;
      this.owner = restData.owner || null;
      this.model = restData.model || null;
      this._embedded = restData._embedded || null;
    }
  }
  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------

}
