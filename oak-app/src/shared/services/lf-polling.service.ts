
// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
import LfLoggerService from "./lf-logger.service";

class LfPollingService {
  /** PUBLIC PROPERTIES------------------- */
  /** PUBLIC METHODS --------------------- */

  public async poll(fn: Function, validate: Function, frequencySeconds: number, durationMinutes: number): Promise<any> {
    this.log.debug('poll');

    const maxAttempts = durationMinutes * 60 / frequencySeconds;
    const intervalMilliseconds = frequencySeconds * 1000;

    let attempts = 0;

    const executePoll = async (resolve: Function, reject: Function) => {
      const result = await fn();
      attempts++;

      if (validate(result)) {
        return resolve(result);
      } else if (maxAttempts && attempts === maxAttempts) {
        return reject(new Error(`Max attempts reached: ${attempts}`));
      } else {
        setTimeout(executePoll, intervalMilliseconds, resolve, reject);
      }
    }

    return new Promise(executePoll);
  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfPollingService').logger;

  /** PRIVATE METHODS -------------------- */

}



export default new LfPollingService();

