async function createUser(firstName, lastName, email, password) {
	let response = await fetch(config().apiUrl + '/users', {
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
	if(!response.ok) {
		body = await response.json();
	}

	return {
		response: response,
		body: body
	};
}

var lightform_tokenrefreshflow_mutex = null;
var lightform_refreshedToken_mutexoutcome = null;

async function doRefreshToken() {
	if(lightform_tokenrefreshflow_mutex) {
		return await lightform_refreshedToken_mutexoutcome;
	} else {

		let refresh = async function() {

			let refreshToken = localStorage.getItem('refreshToken');
				if(refreshToken === null) { // you're not logged in
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					localStorage.removeItem('tokenRefreshMutex');
					window.location.href = 'login.html';
				}

				let refreshRequest = new URLSearchParams();
				refreshRequest.append('grant_type', 'refresh_token');
				refreshRequest.append('refresh_token', refreshToken);
				let refreshResponse = await fetch(config().apiUrl + '/token', {
					method: 'post',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: refreshRequest.toString()
				});
				if(!refreshResponse.ok) { // refresh token is revoked
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					localStorage.removeItem('tokenRefreshMutex');
					window.location.href = 'login.html';
				}

				let refreshBody = await refreshResponse.json();
				localStorage.setItem('accessToken', refreshBody.access_token);
				localStorage.setItem('refreshToken', refreshBody.refresh_token);
				lightform_tokenrefreshflow_mutex = null;
				lightform_refreshedToken_mutexoutcome = null;

				return refreshBody.access_token;
		}

		lightform_tokenrefreshflow_mutex = true;
		let outcome = refresh();
		lightform_refreshedToken_mutexoutcome = outcome;
		return await outcome;
	}
}

async function withAccessToken(request) {
	let currentToken = localStorage.getItem('accessToken');
	if(currentToken === null) { // you're not logged in
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		window.location.href = 'login.html';
	}

	let response1 = await request(currentToken);
	if(response1.status != 401) {
		return response1;
	}
	else {
		return await doRefreshToken().then(token => request(token));
	}
}

async function listDevices() {
	let response = await withAccessToken(token =>
		fetch(config().apiUrl + '/devices', {
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

async function getCurrentUser() {
	let response = await withAccessToken(token =>
		fetch(config().apiUrl + '/users/me', {
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

async function authenticate(email, password) {
	let response = await fetch(config().apiUrl + '/token', {
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
}

async function updatePassword(newPassword) {
	return await withAccessToken(token =>
		fetch(config().apiUrl + '/users/me/password', {
			method: 'put',
			headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ password: newPassword })
		})
	);
}

async function registerDevice(name, serialNumber) {
	let response = await withAccessToken(token =>
		fetch(`${config().apiUrl}/devices`, {
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
	if(!response.ok) {
		body = await response.json();
	}

	return {
		response: response,
		body: body
	};
}
