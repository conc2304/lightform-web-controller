
async function signup() {
	var warning = document.getElementById('password-feedback');

	var first = document.getElementById('first-name-input').value;
	var last = document.getElementById('last-name-input').value;
	var email = document.getElementById('email-input').value;
	var passwordInput = document.getElementById('password-input');
	var password = passwordInput.value;

	let progressBar = document.getElementById('submit-progress');

	let submitButton = document.getElementById('submit');
	submitButton.disabled = true;

	passwordInput.classList.remove('is-invalid');

	progressBar.style.display = 'block';

	var response = await createUser(first, last, email, password);

	submitButton.disabled = false;
	progressBar.style.display = 'none';

	if(!response.response.ok) {
		warning.textContent = response.body.fields[0].message;
		passwordInput.classList.add('is-invalid');
	} else {
		window.location.href = 'signupThanks.html';
	}
}
