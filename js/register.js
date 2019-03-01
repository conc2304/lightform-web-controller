
function register(deviceName, deviceSn) {
	var warning = document.getElementById('register-warning');
	warning.style.display = "none";

	fetch(`${config().apiUrl}/devices`, {
		method: 'post',
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: deviceName,
			serialNumber: deviceSn
		})
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
