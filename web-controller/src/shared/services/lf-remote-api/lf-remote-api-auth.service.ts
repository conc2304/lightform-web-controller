// ==== Library Imports =======================================================
// none
// ==== App Imports ===========================================================
import { LfConf } from "../../../global/LfConfig";
import state from "../../../store/lf-app-state.store";
import LfLoggerService from "../lf-logger.service";

class LfRemoteApiAuth {
	/** PUBLIC PROPERTIES------------------- */

	/** PUBLIC METHODS --------------------- */
	public async isLoggedIn() {
		return !(!state.user || localStorage.getItem('accessToken') === null || localStorage.getItem('refreshToken') === null);
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
		this.log.debug("getCurrentUser");

		const response = await this.withAccessToken((token: string) =>
			fetch(LfConf.apiUrl + '/users/me', {
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
		this.log.debug("withAccessToken", request);

		let currentToken = localStorage.getItem('accessToken');

		if (currentToken === null) { // you're not logged in
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
		}

		let response1 = await request(currentToken);
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

		if (refreshToken === null) { // you're not logged in
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
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: refreshRequest.toString()
		});

		if (!refreshResponse.ok) { // refresh token is revoked
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('tokenRefreshMutex');
		}

		const refreshBody = await refreshResponse.json();
		localStorage.setItem('accessToken', refreshBody.access_token);
		localStorage.setItem('refreshToken', refreshBody.refresh_token);
		this.lightform_tokenrefreshflow_mutex = null;
		this.lightform_refreshedToken_mutexoutcome = null;

		return refreshBody.access_token;
	}
}

export default new LfRemoteApiAuth();
