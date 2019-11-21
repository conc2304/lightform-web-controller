
async function loadConfig() {
	return fetch('config/env.json')
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			let moddedJson = {...{apiUrl: `http://${window.location.hostname}`}, ...json}
			sessionStorage.setItem('config', JSON.stringify(moddedJson));
		});
}

function config() {
	return JSON.parse(sessionStorage.getItem('config'));
}
