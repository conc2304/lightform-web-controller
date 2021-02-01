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
    // const authToken = Android.getAuthToken();

    const authToken = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMzA5MDQyMC00YTM5LTRmYmItYTIzYy0wMmQ5YjQ0YmFhYTgiLCJleHAiOjE2MTIyMjgyODgsIm5iZiI6MTYxMjIwNjY4OCwiaWF0IjoxNjEyMjA2Njg4LCJqdGkiOiI0NTU5IiwiaG1uIjp0cnVlfQ.uwIN-dY5NsmfjiO7ybIftv7fu2JkuADxrLxEXKdejw9uBEoDsPaq2O7VAYenUfuJFB7pvTBRxYJ3Am_Hi9r7uA';

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
