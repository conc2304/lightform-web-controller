
function init() {
	var fragmentParams = new URLSearchParams(window.location.hash.replace('#', ''));
	if(fragmentParams.has('message')) {
		var message = fragmentParams.get('message');
		var messageDiv = document.getElementById('message');
		messageDiv.textContent = message;
		messageDiv.style.display = "block";
	}
}

function login() {
	let email = document.getElementById('email-input').value;
	let password = document.getElementById('password-input').value;

	var warning = document.getElementById('password-warning');
	warning.style.display = "none";
	var warningText = document.getElementById('password-warning-text');
	warningText.textContent = "Incorrect email or password";

	var progress = document.getElementById('login-progress');
	progress.style.display = "block";

	serviceClient.authenticate(email, password)
		.then(async res => {
			let response = res.response;
			let json = res.body;

			if(!response.ok) {
				if(json.error == 'email_unverified') {
					window.location.href = `signupThanks.html#${encodeURIComponent(email)}`;
				}
				if(json.error == 'rate_limited') {
					warningText.textContent = "Too many login attempts have been made for this user, try again in a minute.";
				}
				warning.style.display = "block";
				progress.style.display = "none";
			} else {
				localStorage.setItem('accessToken', json.access_token);
				localStorage.setItem('refreshToken', json.refresh_token);
				window.location.href = 'account.html';
			}
	});

	return false;
}
