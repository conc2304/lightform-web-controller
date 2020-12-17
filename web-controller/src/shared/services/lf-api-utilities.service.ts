
// ==== Library Imports =======================================================
// none
// ==== App Imports ===========================================================
import LfLoggerService from "./lf-logger.service";

class LfApiUtilityService {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */
  public checkResponseStatus(response) {
    this.log.debug("checkResponseStatus");
    this.log.debug(response);

    if (response && response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      const error = response.statusText || "Unknown Status Error"
      return Promise.reject(error);
    }
  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfTokenApiService').logger;


  /** PRIVATE METHODS -------------------- */
}

export default new LfApiUtilityService();
