function init() {
	let devicesTemplate = Handlebars.compile(document.getElementById("devices-template").innerHTML);

	listDevices()
		.then(res => {
			if(res.response.status == 401) {
				localStorage.removeItem('accessToken');
				window.location.href = 'login.html';
			}
			document.getElementById('devices').innerHTML = devicesTemplate(res.body._embedded);
		});
}

function register() {
	var warning = document.getElementById('register-warning');
	warning.style.display = "none";

	let deviceName = document.getElementById('device-name-input').value;
	let deviceSn = document.getElementById('serial-number-input').value;

	registerDevice(deviceName, deviceSn)
		.then(response => {
			if(response.response.ok) {
				window.location.reload();
			}
			else {
				document.getElementById('register-warning-text').textContent = response.body.message;
				warning.style.display = "block";
			}
		});

	return false;
}

