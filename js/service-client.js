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

async function listDevices() {
	let response = await fetch(config().apiUrl + '/devices', {
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
		}
	});

	return {
		response: response,
		body: await response.json()
	};
}

async function getCurrentUser() {
	let response = await fetch(config().apiUrl + '/users/me', {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
			}
	});

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
	return await fetch(config().apiUrl + '/users/me/password', {
		method: 'put',
		headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
		},
		body: JSON.stringify({ password: newPassword })
	});
}

async function registerDevice(name, serialNumber) {
	let response = await fetch(`${config().apiUrl}/devices`, {
		method: 'post',
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			serialNumber: serialNumber
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
