
api = 'https://api.dev.cloud.lightform.com'

function init() {
    var source = document.getElementById("account-template").innerHTML
    var template = Handlebars.compile(source)

    fetch(api + '/users/me', {
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
        document.getElementById('account').innerHTML = template(json);
    })
}

function onPasswordUpdate(newPassword) {
    fetch(api + '/users/me/password', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ password: newPassword })
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
}