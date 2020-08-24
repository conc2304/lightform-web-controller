async function init() {
	if (localStorage.getItem('accessToken') === null) {
		window.location = `login.html#then=${encodeURIComponent(window.location)}`;
	} else {

		var source = document.getElementById("authz-card-template").innerHTML;
		var template = Handlebars.compile(source);

		let requestParams = new URLSearchParams(window.location.search);
		let scopes = []

		if (requestParams.get('scope')) {
			requestParams.get('scope').split(' ').map(scope => {
				let scopeUrl = new URL('http://example.com' + scope)
				let permissions = scopeUrl.hash.replace('#', '').split(' ');
				if (scopeUrl.pathname == '/devices') {
					if (permissions.includes('control')) {
						scopes.push('Control playback on all devices.');
					}
				} else {
					scopes.push('Other unknown permissions. You should probably deny this.')
				}
			});
		}

		let registeredClient = await serviceClient.retrieveClient(requestParams.get('client_id'));

		let rejectUri = requestParams.get('redirect_uri');
		if (!rejectUri) {
			if (!registeredClient.redirectUri) {
				console.error("No redirect URI registered for client, and none provided in authz request.");
			}
			rejectUri = registeredClient.redirectUri;
		}
		rejectUri = new URL(rejectUri);
		rejectUri.searchParams.append("error", "access_denied");
		if (requestParams.has('state')) {
			rejectUri.searchParams.append("state", requestParams.get('state'));
		}

		let params = {
			firstName: (await serviceClient.getCurrentUser()).body.firstName,
			clientName: registeredClient.name,
			permissions: scopes.map(scope => { return { permission: scope } }),
			rejectUri: rejectUri
		}

		document.getElementById('authz-card').innerHTML = template(params);
	}
}

async function onAccept() {
	let requestParams = new URLSearchParams(window.location.search);

	let { redirect, error } = await serviceClient.authzCodeRequest(
		requestParams.get('client_id'),
		requestParams.get('redirect_uri'),
		requestParams.get('scope'),
		requestParams.get('state')
	);

	if (redirect) {
		window.location = redirect;
	} else {
		console.error(error);
	}
}

