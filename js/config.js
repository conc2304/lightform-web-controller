
async function loadConfig() {
	return fetch('config/env.json')
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			sessionStorage.setItem('config', JSON.stringify(json));
		});
}

function config() {
	return JSON.parse(sessionStorage.getItem('config'));
}
