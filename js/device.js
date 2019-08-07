
function init(deviceId) {
    var source = document.getElementById("device-template").innerHTML
    var template = Handlebars.compile(source)

    fetch(`${config().apiUrl}/devices/${deviceId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        if(response.status == 401) {
            localStorage.removeItem('accessToken');
            window.location.href = 'login.html';
        }
    })
    .then(json => {
			let merged = {...json, ...json._embedded.info};

			if(merged.offlineSince != null) {
				merged.statusImg = 'img/offline.svg';
				merged.offlineSince = new Date(merged.offlineSince).toLocaleString();
			} else {
				merged.statusImg = 'img/online.svg';
			}

			document.getElementById('device').innerHTML = template(merged);
    })
}

function onRemoveSafety() {
    document.getElementById('deregister-safety').style.display = "none";
    document.getElementById('deregister-trigger').style.display = "block";
}

function deregisterDevice(deviceId) {
    fetch(`${config().apiUrl}/devices/${deviceId}`, {
        method: 'delete',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => {
        window.location.href = 'account.html';
    });
}
