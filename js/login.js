
function init() {
	var fragmentParams = new URLSearchParams(window.location.hash.replace('#', ''));
	if(fragmentParams.has('message')) {
		var message = fragmentParams.get('message');
		var messageDiv = document.getElementById('message');
		messageDiv.textContent = message;
		messageDiv.style.display = "block";
	}
}

function login(email, password) {
		var warning = document.getElementById('password-warning');
		warning.style.display = "none";
		var warningText = document.getElementById('password-warning-text');

		var progress = document.getElementById('login-progress');
		progress.style.display = "block";

		fetch(config().apiUrl + '/token', {
			method: 'post',
			headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `grant_type=password&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
		})
		.then(async function(response) {
			var json = await response.json();

			if(!response.ok) {
				if(json.error == 'email_unverified') {
					warningText.textContent = json.error_description;
					document.getElementById('login-button').style.display = "none";
					document.getElementById('resend-verification-button').style.display = "block";
				}
				warning.style.display = "block";
				progress.style.display = "none";

			} else {
				localStorage.setItem('accessToken', json.access_token);
				window.location.href = 'devices.html';
			}
		});

		return false;
}

function resendVerificationEmail(email) {
	fetch(`${config().apiUrl}/users/${encodeURIComponent(email)}/email/verificationRequests`, {
		method: 'post'
	})
	.then(response => {
			if(!response.ok) {
				window.location.href = 'login.html#message=' + encodeURIComponent("Ouch, something went wrong")
			} else {
				window.location.href = 'signup-thanks.html';
			}
	});
}
