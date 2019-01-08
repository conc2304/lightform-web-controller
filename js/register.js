
api = 'https://api.dev.cloud.lightform.com'

function register(deviceId) {
	var warning = document.getElementById('register-warning');
	warning.style.display = "none";

	fetch(`${api}/devices/${deviceId}`, {
		method: 'put',
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
		}
	})
	.then(response => {
		if(response.ok) {
			window.location.href = 'devices.html';
		}
		else {
			response.json()
				.then(json => {
					document.getElementById('register-warning-text').textContent = json.message;
					warning.style.display = "block";
				})
		}
	});

	return false;
}
