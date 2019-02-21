
function signup(email, first, last, password) {
	var warning = document.getElementById('signup-warning');
	warning.style.display = "none";

	fetch(config().apiUrl + '/users', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			firstName: first,
			name: `${first} ${last}`,
			lastName: last,
			email: email,
			password: password
		})
	})
	.then(response => {
		response.json()
			.then(json => {
					if(!response.ok) {
						document.getElementById('signup-warning-text').textContent = json.fields[0].message;
						warning.style.display = "block";
					} else {
						window.location.href = 'signup-thanks.html';
					}
			})
	});
}
