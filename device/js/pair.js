import { render, html, useState } from './preact-htm.module.js';

function Network(props) {
	let icon = "img/network-1bar.svg";
	if (props.signal >= 66) {
		icon = "img/network-3bars.svg";
	} else if (props.signal >= 33) {
		icon = "img/network-2bars.svg";
	}

	return html`
		<img class=wifi-icon src=${icon}></img>
		<b class=network-name>${props.ssid}</b>
	`;
}

function NetworkList(props) {
	props.networks.sort((a, b) => -1 * (a.signal - b.signal));

	return html`
		<ul class="list-group striped-list">
			${props.networks.map(network => html`
				<button
					class="
						list-group-item
						list-group-item
						list-group-item-action
						${network.ssid === props.activeNetwork ? "active" : ""}
					"
					onClick=${() => props.onActiveChanged(network)}
				>
					<${Network} ...${network}/>
				</button>
			`)}
		</ul>
	`;
}

function NetworkSelector(props) {

	const [state, setState] = useState({ activeNetwork: {}, password: "" });

	function onActiveChanged(network) {
		setState(s => Object.assign({}, s, { activeNetwork: network }));
	}

	function unsecured() {
		console.log(state.activeNetwork.security);
		return state.activeNetwork.security == undefined ||
			state.activeNetwork.security.toUpperCase() == 'UNSECURED';
	}

	function disableSubmit() {
		return state.activeNetwork.ssid === undefined ||
			(!unsecured() && !state.password);
	}

	function onPasswordChanged(e) {
		setState(s => Object.assign({}, s, {password: e.target.value}));
	}

	return html`<div class="network-selector-container mt-sm-5">
		<div class="network-selector">
		<div class="mb-3 mt-3 mr-2 ml-2">Select the Wi-Fi network you would like to pair your Lightform device to.</div>
		<${NetworkList}
			networks=${props.networks}
			onActiveChanged=${onActiveChanged}
			activeNetwork=${state.activeNetwork.ssid}
		/>

		${!unsecured() ?
			html`
			<div class="form-group row mt-3 network-password">
			<label for="inputPassword" class="col-form-label">Wi-Fi Network's Password</label>
			<div class="col-sm-7">
				<input
					type="text"
					class="form-control"
					id="inputPassword"
					placeholder="Password"
					value=${state.password}
					onInput=${onPasswordChanged}
				>
			</div>
			</div>
			</div>
			`
			: ""
		}

			<button
				type="button"
				style="float: right;"
				class="
					btn btn-success
					pair-button
					mt-3
					mr-4
					${disableSubmit() ? "disabled" : ""}
				"
				onclick=${() => {
					const network = state.activeNetwork;
					network.psk = state.password;
					return connectToNetwork(network);
				}}
			> Pair
			</button>
</div>

	</div>`;
}

function connectToNetwork(network) {
	let rand = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
	let body = {
		jsonrpc: '2.0',
		id: rand.toString(),
		method: 'connectToNetwork',
		params: network
	}

	fetch(
		`${config.apiUrl}/rpc`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
	).then(response =>
		// todo handle failure
		window.location.href = "#complete"
	);
}

async function init() {

	async function networkSelector() {
		const networksResponse = await fetch(`${config.apiUrl}/networkState`);

		// todo handle failure

		const networks = (await networksResponse.json()).availableWifiNetworks;

		return html`<${NetworkSelector} networks=${networks}/>`;
	}

	const app =window.location.hash.includes('complete')
		? html`<h3>Please reconnect to your network.</h3>
		<h4>(this may happen automatically)</h4>`
		: await networkSelector();

	render(app, document.body);
}

init();
