
api = 'https://api.dev.cloud.lightform.com'

function init() {
    var source = document.getElementById("devices-template").innerHTML
    var template = Handlebars.compile(source)

    fetch(api + '/devices', {
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
        document.getElementById('devices').innerHTML = template(json._embedded);
    })
}