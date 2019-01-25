
function init() {
    var source = document.getElementById("devices-template").innerHTML
    var template = Handlebars.compile(source)

    fetch(config().apiUrl + '/devices', {
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
