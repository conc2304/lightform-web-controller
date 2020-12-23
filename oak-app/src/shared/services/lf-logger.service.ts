// ==== Library Imports =======================================================
import JsLogger, { ILogger, ILogLevel } from "js-logger";
import { LfConf } from "../../global/resources";

// ==== App Imports ===========================================================


class LfLoggerService {
  public logger: ILogger
  constructor(namedLogger: string) {
    JsLogger.useDefaults();

    this.logger = JsLogger.get(namedLogger);
    const LogLevel: ILogLevel = LfConf.internalOnly ? this.logger.INFO : this.logger.WARN;
    this.logger.setLevel(LogLevel);
  }
}

export default LfLoggerService;
