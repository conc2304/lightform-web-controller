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

	const [state, setState] = useState({ activeNetwork: {}, password: null });

	function onActiveChanged(network) {
		setState(s => Object.assign({}, s, { activeNetwork: network }));
	}

	function unsecured() {
		return state.activeNetwork.security == undefined ||
		state.activeNetwork.security == 'Unsecured';
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
			> Pair
			</button>
</div>

	</div>`;
}

const app = html`<${NetworkSelector} networks=${[
	{ ssid: 'Netgear123', signal: 10, security: 'WPA2' },
	{ ssid: 'NachoWiFi', signal: 50, security: 'Unsecured' }
]} />`;

render(app, document.body);
