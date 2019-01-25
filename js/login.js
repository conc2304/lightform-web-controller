
function login(email, password) {
    var warning = document.getElementById('password-warning');
    warning.style.display = "none";

    var progress = document.getElementById('login-progress');
    progress.style.display = "block";

    fetch(config().apiUrl + '/token', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=password&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(response => {
        if(!response.ok) {
            warning.style.display = "block";
            progress.style.display = "none";
        } else {
            response.json()
            .then(json => {
                localStorage.setItem('accessToken', json.access_token);
                window.location.href = 'devices.html';
            })
        }
    });

    return false;
}
