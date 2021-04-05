// ==== Library Imports =======================================================
// none

// ==== App Imports ===========================================================
import { LfConf } from '../../../global/LfConfig';
import LfLoggerService from '../lf-logger.service';

class LfRemoteApiAuth {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */
  public isLoggedIn() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken')
    const accessTokenValid = accessToken !== null && typeof accessToken !== 'undefined';
    const refreshTokenValid = refreshToken !== null && typeof refreshToken !== 'undefined';
    return accessTokenValid && refreshTokenValid;
  }

  public async authenticate(email: string, password: string) {

    const response = await fetch(`${LfConf.apiUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=password&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })

    return {
      response: response,
      body: await response.json()
    }
  }

  public async getCurrentUser() {
    this.log.debug('getCurrentUser');

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);

    const response = await this.withAccessToken((token: string) =>
      fetch(LfConf.apiUrl + '/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    );

    clearTimeout(id);

    return {
      response: response,
      body: await response.json()
    };
  }

  public async requestReset(email: string) {
    this.log.debug('requestReset');

    return fetch(`${LfConf.apiUrl}/users/${encodeURIComponent(email)}/password`, {
      method: 'DELETE'
    })
      .then(async response => {

        if (response.ok) {
          return Promise.resolve()
        } else {
          var json = await response.json();
          console.log(json);
          return Promise.reject(json);
        }
      });
  }

  public async createUser(firstName: string, lastName: string, email: string, password: string) {
    this.log.debug('createUser');

    let response = await fetch(LfConf.apiUrl + '/users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstName,
        name: `${firstName} ${lastName}`,
        lastName: lastName,
        email: email,
        password: password
      })
    });

    let body = null;
    if (!response.ok) {
      body = await response.json();
    }

    return {
      response: response,
      body: body
    };
  }


  public async getRegistrationCode() {
    this.log.debug("getRegistrationCode");

    const response = await this.withAccessToken((token: string) =>
      fetch(LfConf.apiUrl + '/users/me/registrationCode', {

        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    );

    return {
      response: response,
      body: await response.json()
    };
  }

  public async withAccessToken(request) {
    this.log.debug('withAccessToken', request);

    let currentToken = localStorage.getItem('accessToken');

    if (currentToken === null) {
      // you're not logged in
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    const response1 = await request(currentToken);
    if (response1.status === 401) {
      return await this.doRefreshToken().then(token => request(token));
    }
    else {
      return response1;
    }
  }

  /** PRIVATE PROPERTIES ----------------- */
  private log = new LfLoggerService('LfRemoteApiAuth').logger;
  private lightform_tokenrefreshflow_mutex = null;
  private lightform_refreshedToken_mutexoutcome = null;

  /** PRIVATE METHODS -------------------- */

  private async doRefreshToken() {
    this.log.debug("doRefreshToken");

    if (this.lightform_tokenrefreshflow_mutex) {
      return await this.lightform_refreshedToken_mutexoutcome;
    } else {
      this.lightform_tokenrefreshflow_mutex = true;
      let outcome = this.refresh();
      this.lightform_refreshedToken_mutexoutcome = outcome;
      return await outcome;
    }
  }

  private async refresh() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken === null) {
      // you're not logged in
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenRefreshMutex');
    }

    const refreshRequest = new URLSearchParams();
    refreshRequest.append('grant_type', 'refresh_token');
    refreshRequest.append('refresh_token', refreshToken);

    const refreshResponse = await fetch(LfConf.apiUrl + '/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: refreshRequest.toString(),
    });

    if (!refreshResponse.ok) {
      // refresh token is revoked
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenRefreshMutex');
    }

    const refreshBody = await refreshResponse.json();

    refreshBody.access_token ? localStorage.setItem('accessToken', refreshBody.access_token) : null;
    refreshBody.refresh_token ? localStorage.setItem('refreshToken', refreshBody.refresh_token) : null;
    this.lightform_tokenrefreshflow_mutex = null;
    this.lightform_refreshedToken_mutexoutcome = null;

    return refreshBody.access_token;
  }
}

export default new LfRemoteApiAuth();
