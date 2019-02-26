
function requestReset(email) {

	fetch(`${config().apiUrl}/users/${encodeURIComponent(email)}/password`, {
		method: 'delete'
	})
	.then(async response => {
		var warning = document.getElementById('warning');
		warning.style.display = "none";
		if(response.ok) {
			window.location.href = `login.html#message=${encodeURIComponent(`Please check ${email} for a password reset email (don't forget to look in your spam folder, just in case).`)}`;
		} else {
			var json = await response.json();
			console.log(json);
			document.getElementById('warning-text').textContent = json.message;
			warning.style.display = "block";
		}
	});

	return false;
}

function validate() {
	var password = document.getElementById("password-input");
	var confirmation = document.getElementById("confirm-password-input");
	if(password.value != confirmation.value) {
		confirmation.setCustomValidity("Passwords do not match")
	} else {
		confirmation.setCustomValidity('')
	}
}

function resetPassword(code, newPassword) {
	fetch(config().apiUrl + '/users/me/password', {
		method: 'put',
		headers: {
				'Content-Type': 'application/json',
				'Authorization': `X-PW-Reset ${code}`
		},
		body: JSON.stringify({ password: newPassword })
	})
	.then(response => {
			if(response.ok) {
				window.location.href = `login.html#message=${encodeURIComponent("Password updated, please log in")}`
			} else {
				response.json()
					.then(json => {
						var warning = document.getElementById('warning');
						document.getElementById('warning-text').textContent = json.message;
						if(json.fields) {
							document.getElementById('warning-text').textContent = json.fields[0].message;
						}
						warning.style.display = "block";
					})
			}
	})
}
