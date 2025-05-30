let serviceClient = {

	createUser: async function (firstName, lastName, email, password) {
		let response = await fetch(config.apiUrl + '/users', {
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
	},

	lightform_tokenrefreshflow_mutex: null,
	lightform_refreshedToken_mutexoutcome: null,
	// there is a possible issue here where different window contexts try to enter the critical section at the same time
	doRefreshToken: async function () {
		if (this.lightform_tokenrefreshflow_mutex) {
			return await this.lightform_refreshedToken_mutexoutcome;
		} else {

			let refresh = async function () {

				let refreshToken = localStorage.getItem('refreshToken');
				if (refreshToken === null) { // you're not logged in
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					localStorage.removeItem('tokenRefreshMutex');
					window.location.href = 'login.html';
				}

				let refreshRequest = new URLSearchParams();
				refreshRequest.append('grant_type', 'refresh_token');
				refreshRequest.append('refresh_token', refreshToken);
				let refreshResponse = await fetch(config.apiUrl + '/token', {
					method: 'post',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: refreshRequest.toString()
				});
				if (!refreshResponse.ok) { // refresh token is revoked
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					localStorage.removeItem('tokenRefreshMutex');
					window.location.href = 'login.html';
				}

				let refreshBody = await refreshResponse.json();
				localStorage.setItem('accessToken', refreshBody.access_token);
				localStorage.setItem('refreshToken', refreshBody.refresh_token);
				this.lightform_tokenrefreshflow_mutex = null;
				this.lightform_refreshedToken_mutexoutcome = null;

				return refreshBody.access_token;
			}

			this.lightform_tokenrefreshflow_mutex = true;
			let outcome = refresh();
			this.lightform_refreshedToken_mutexoutcome = outcome;
			return await outcome;
		}
	},

	withAccessToken: async function (request) {
		let currentToken = localStorage.getItem('accessToken');
		if (currentToken === null) { // you're not logged in
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			window.location.href = 'login.html';
		}

		let response1 = await request(currentToken);
		if (response1.status === 401) {
			return await this.doRefreshToken().then(token => request(token));
		}
		else {
			return response1;
		}
	},

	listDevices: async function (embedInfo) {
		var embed = '';
		if (embedInfo) {
			embed = '?embed=info';
		}
		let response = await this.withAccessToken(token =>
			fetch(config.apiUrl + '/devices' + embed, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		);

		return {
			response: response,
			body: await response.json()
		};
	},

	getCurrentUser: async function () {
		let response = await this.withAccessToken(token =>
			fetch(config.apiUrl + '/users/me', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		);

		return {
			response: response,
			body: await response.json()
		};
	},

	authenticate: async function (email, password) {
		let response = await fetch(config.apiUrl + '/token', {
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `grant_type=password&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
		});

		return {
			response: response,
			body: await response.json()
		};
	},

	updatePassword: async function (newPassword) {
		return await this.withAccessToken(token =>
			fetch(config.apiUrl + '/users/me/password', {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ password: newPassword })
			})
		);
	},

	updateName: async function (firstName, lastName) {
		return await this.withAccessToken(token =>
			fetch(config.apiUrl + '/users/me', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
				})
			})
		);
	},

	registerDevice: async function (name, serialNumber) {
		let response = await this.withAccessToken(token =>
			fetch(`${config.apiUrl}/devices`, {
				method: 'post',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: name,
					serialNumber: serialNumber
				})
			})
		);

		let body = null;
		if (!response.ok) {
			body = await response.json();
		}

		return {
			response: response,
			body: body
		};
	},

	retrieveZendeskToken: async function () {
		let response = await this.withAccessToken(token =>
			fetch(`${config.apiUrl}/token/zendesk`, { headers: { Authorization: `Bearer ${token}` } })
		);

		var body = null;
		if (response.ok) {
			body = response.text();
		} else {
			body = response.json();
		}

		return {
			response: response,
			body: await body
		}
	},

	retrieveDevice: async function (deviceId) {
		let response = await this.withAccessToken(token =>
			fetch(`${config.apiUrl}/devices/${deviceId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		);

		return {
			response: response,
			body: await response.json()
		};
	},

	retrievePlaybackParameters: async function (deviceId) {
		let response = await this.withAccessToken(token =>
			fetch(`${config.apiUrl}/devices/${deviceId}/slideParameters`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		);

		return {
			response: response,
			body: await response.json()
		};
	},

	play: async function (deviceSn) {
		return await this.rpcRequest(deviceSn, 'play', null);
	},

	pause: async function (deviceSn) {
		return await this.rpcRequest(deviceSn, 'pause', null);
	},

	stop: async function (deviceSn) {
		return await this.rpcRequest(deviceSn, 'stop', null);
	},

	rpcRequest: async function (deviceSn, method, params) {
		let body = {
			jsonrpc: '2.0',
			id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
			method: method
		}

		if (params) {
			body.params = params;
		}

		let httpResponse = await this.withAccessToken(token =>
			fetch(`${config.apiUrl}/devices/${deviceSn}/rpc/${method}`, {
				method: 'post',
				headers: { 'Authorization': `Bearer ${token}` },
				body: JSON.stringify(body)
			})
		);

		return await httpResponse.json();
	},

	setParameter: function (deviceSn, name, slideName, value, type) {
		return this.rpcRequest(deviceSn, 'setParameterValue', {
			name: name,
			slideName: slideName,
			value: value.toString(),
			type: type
		});
	},

	retrieveClient: function (clientId) {
		return fetch(`${config.apiUrl}/clients/${clientId}`)
			.then(response => response.json());
	},

	authzCodeRequest: async function (clientId, redirectUri, scope, state) {
		let requestBody = new URLSearchParams();
		requestBody.append('response_type', 'code');
		requestBody.append('client_id', clientId);
		if (redirectUri) {
			requestBody.append('redirect_uri', redirectUri);
		}
		if (scope) {
			requestBody.append('scope', scope);
		}
		if (state) {
			requestBody.append('state', state);
		}

		let response = await this.withAccessToken(token =>
			fetch(`${config.apiUrl}/authorize`, {
				method: 'post',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/x-www-form-urlencoded',
					'Access-Control-Request-Headers': 'Location'
				},
				redirect: 'manual',
				body: requestBody.toString()
			})
		);

		if (response.headers.get("Location")) {
			return { redirect: response.headers.get("Location") };
		} else {
			return { error: await response.json() };
		}
	}
}
