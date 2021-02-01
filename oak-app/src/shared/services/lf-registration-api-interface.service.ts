// ==== Library Imports =======================================================
// none


import { LfConf } from "../../global/resources";
import LfLoggerService from "./lf-logger.service";

// ==== App Imports ===========================================================

class LfRegistrationApiInterface {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */

  public async postRegistrationCode(registrationCode: string) {
    this.log.warn('postRegistrationCode');

    // @ts-ignore Android
    const authToken = Android.getAuthToken();

    const response = await fetch(`${LfConf.apiUrl}/devices/me/registrationCode`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(registrationCode),
    })

    return {
      response: response,
      body: await response.json()
    }
  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfRegistrationApiInterface').logger;

  /** PRIVATE METHODS -------------------- */

}

export default new LfRegistrationApiInterface();
