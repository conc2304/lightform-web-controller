// ==== Library Imports =======================================================
// none


import { LfConf } from "../../global/resources";
import LfLoggerService from "./lf-logger.service";

// ==== App Imports ===========================================================

class LfRegistrationApiInterface {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */

  public async postRegistrationCode(registrationCode: string) {
    this.log.debug('postRegistrationCode');

    // @ts-ignore Android
    const authToken = Android.getAuthToken();

    const response = await fetch(`${LfConf.apiUrl}/devices/me/registration`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `X-Device ${authToken}`
      },
      body: JSON.stringify({ code: registrationCode }),
    });

    return response.ok ? Promise.resolve() : Promise.reject();
  }

  public getCurrentFirmwareVersion(): string {
    this.log.debug('getCurrentFirmwareVersion');
    // @ts-ignore Android
    const currentFwVerison = Android.getCurrentFirmwareVersion();
    return currentFwVerison;
  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfRegistrationApiInterface').logger;

  /** PRIVATE METHODS -------------------- */
}

export default new LfRegistrationApiInterface();
