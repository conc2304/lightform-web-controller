// ==== Library Imports =======================================================
// none
// ==== App Imports ===========================================================
import { LfConf } from '../../../global/LfConfig';
import LfLoggerService from '../lf-logger.service';
import lfRemoteApiAuthService from './lf-remote-api-auth.service';

export interface SetContentParams {
  deviceSerial: string;
  projectId: string;
  slide: number | string;
  hdmiIndex: number;
}

class LfRPCApiService {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */
  public async rpcRequest(deviceSn: string, method: string, params: any) {
    this.log.debug('rpcRequest');

    const body = {
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
      method: method,
      params: null,
    };

    if (params) {
      body.params = params;
    }

    const httpResponse = await lfRemoteApiAuthService.withAccessToken(token =>
      fetch(`${LfConf.apiUrl}/devices/${deviceSn}/rpc/${method}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      }),
    );

    return await httpResponse.json();
  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfRPCApiService').logger;

  /** PRIVATE METHODS -------------------- */
}

export default new LfRPCApiService();
