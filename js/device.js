
api = 'https://api.dev.cloud.lightform.com'

function init(deviceId) {
    var source = document.getElementById("device-template").innerHTML
    var template = Handlebars.compile(source)

    fetch(`${api}/devices/${deviceId}`, {
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
        document.getElementById('device').innerHTML = template(json);
    })
}

function onRemoveSafety() {
    document.getElementById('deregister-safety').style.display = "none";
    document.getElementById('deregister-trigger').style.display = "block";
}

function deregisterDevice(deviceId) {
    fetch(`${api}/devices/${deviceId}`, {
        method: 'delete',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => {
        window.location.href = 'devices.html'
    });
}