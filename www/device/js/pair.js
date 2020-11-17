// Library Imports
import { render, html, useState } from "./preact-htm.module.js";

// App Imports
import "../js/custom-elements/index.js"; // Lightform Web Components
import { config } from "../config/env.js";
import { MockNetworkStateResponse } from "../js/mock-data/mock-network-state.response.js"; // NOT FOR PRODUCTION

// Required Assets
const LF_LOGO_SRC = require("../img/Wordmark White.svg");
const NET_STRONG_SRC = require("../img/network-3bars.svg");
const NET_MED_SRC = require("../img/network-2bars.svg");
const NET_WEAK_SRC = require("../img/network-1bar.svg");
const NET_LOCK_SRC = require("../img/netlock.svg");

// Private Properties
// --------------------------------------
let appState = null;
let setAppState = null;
let connectingToNetwork = false;

// Initialization
// --------------------------------------
(function onDocumentLoad() {
	try {
		console.log(config);

		// mock data only used for show and tell
		if (
			typeof config !== "undefined" &&
			config.apiUrl &&
			!!MockNetworkStateResponse
		) {
			delete MockNetworkStateResponse;
		}
		initView();
	} catch (error) {
		console.error(error);
		renderFailedView();
	}
})();

async function initView() {
	try {
		renderLoadingView();

		if (window.location.hash.includes("complete")) {
			renderCompleteView();
		} else {
			const appBody = await renderNetworkSelectorView();
			renderView(appBody);
		}
	} catch (error) {
		console.error(error);
		renderFailedView();
	}
}

function restartPairing() {
	window.location.href = "";
	initView();
}

// Views/Renderings
// --------------------------------------
async function renderNetworkSelectorView() {
	const availableWifiNetworks = await getAvailableNetworks();
	console.log(availableWifiNetworks);

	if (!availableWifiNetworks.length) {
		throw new Error("No Available Networks");
	} else {
		return html`<${networkSelectorComponent}
			networks=${availableWifiNetworks}
		/>`;
	}
}

function heroContentHtml() {
	return html`
		<div class="hero--wrapper">
			<img class="lf-logo" src="./${LF_LOGO_SRC}" />
			<h4 class="sub-header">Connect your device to the internet</h4>
		</div>
	`;
}

function renderLoadingView() {
	const appContent = html`
		<div class="loading-view--wrapper">
			<p>searching for available networks...</p>
			<div class="loading-ellipsis">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	`;

	renderView(appContent);
}

function renderView(appContent) {
	const app = html`
		<div class="page--wrapper">
			<div class="page--inner">
				${heroContentHtml()}
				<div class="page--content lf-card">${appContent}</div>
			</div>
		</div>
	`;

	render(app, document.body);
}

function networkListHtml(props) {
	props.networks.sort((a, b) => -1 * (a.signal - b.signal));

	return html`
		<lf-list striped>
			${props.networks.map((network) => {
				return html`
					<lf-list-item
						button
						active=${network.ssid === props.activeNetwork}
						onClick=${() => props.onActiveChanged(network)}
					>
						<img
							slot="start"
							class="network-icons"
							src="./${signalStrengthPath(network.signal)}"
						/>
						<b class="network-name">${network.ssid}</b>
						<img
							slot="end"
							class="network-icons"
							src="./${securityIconPath(network.security)}"
						/>
					</lf-list-item>
				`;
			})}
		</lf-lst>
		<br></br>
	`;
}

function networkSelectorComponent(props) {
	[appState, setAppState] = useState({
		activeNetwork: {},
		password: "",
	});

	return html` <div class="network-selector-container mt-sm-5">
		<div class="cta-prompt mb-3 mt-3 mr-2 ml-2">
			Select the Wi-Fi network you would like to pair your Lightform device to.
		</div>

		<${networkListHtml}
			networks=${props.networks}
			onActiveChanged=${onActiveChanged}
			activeNetwork=${appState.activeNetwork.ssid}
		/>

		${!unsecured()
			? html`
					<div class="password-input-wrapper">
						<lf-text-input
							label="Wi-Fi Network's Password"
							placeholder="Password"
							value=${appState.password}
							onInput=${onPasswordChanged}
							expand="fill"
						>
						</lf-text-input>
					</div>
			  `
			: ""}

		<lf-button
			type="primary"
			disabled=${connectingToNetwork}
			style="float: right; display: ${displaySubmit() ? "none" : "null"}"
			onclick=${() => {
				const network = appState.activeNetwork;
				network.psk = appState.password;
				return connectToNetwork(network);
			}}
			class="mt-3 mr-4"
		>
			${!connectingToNetwork ? "Pair" : "Connecting..."}
		</lf-button>
	</div>`;
}

function renderCompleteView() {
	const appBody = html`
		<div class="reconnect-view">
			<h4>Please reconnect to your network.</h3>
			<h5>(this may happen automatically)</h4>
			<br />

			<div class="cta-container">

			</div>
		</div>
		<p>Not connected yet?</p>
		${restartPairingButtonHtml()}
	`;

	renderView(appBody);
}

function renderFailedView() {
	const appBody = html`
		<div class="failure-view">
			<h3>Unable to get available networks.</h3>
			<h4 class="mt-4">Make sure you are connecting to your <br></br>Lightform device's network and try again.</h4>
			${restartPairingButtonHtml()}
		</div>
		`;

	renderView(appBody);
}

function restartPairingButtonHtml() {
	return html` <div class="restart-pairing-wrapper">
		<lf-button
			class="restart-pairing-button"
			context="secondary"
			size="regular"
			onClick=${() => restartPairing()}
		>
			Restart Pairing
		</lf-button>
	</div>`;
}

// Network Calls
// --------------------------------------
async function getAvailableNetworks() {
	try {
		// Production
		if (typeof config !== "undefined") {
			return await fetch(`${config.apiUrl}/networkState`)
				.then(status)
				.then((response) => response.json())
				.then((data) => {
					return data.availableWifiNetworks
						? Promise.resolve(data.availableWifiNetworks)
						: Promise.reject("availableWifiNetworks is not set");
				})
				.catch((error) => {
					const errorMsg = error ? `- ${error.toString()}` : "";
					throw new Error(`Failed to fetch networkState ${errorMsg}`);
				});
		}
		// Internal
		else if (typeof MockNetworkStateResponse !== "undefined") {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			return MockNetworkStateResponse.data.availableWifiNetworks;
		} else {
			throw new Error(`No API Available`);
		}
	} catch (error) {
		renderFailedView();
	}
}

function connectToNetwork(network) {
	connectingToNetwork = true;

	const rand = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
	const body = {
		jsonrpc: "2.0",
		id: rand.toString(),
		method: "connectToNetwork",
		params: network,
	};

	if (typeof MockNetworkStateResponse !== "undefined") {
		window.location.href = "#complete";
		renderCompleteView();
		return;
	}

	if (typeof config !== "undefined") {
		fetch(`${config.apiUrl}/rpc`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		})
			.then(status)
			.then((response) => response.json())
			.then((response) => {
				console.log("RPC", response);
				window.location.href = "#complete";
				renderCompleteView();
			})
			.catch((error) => {
				throw new Error(error);
			})
			.then(() => {
				connectingToNetwork = false;
			});
	} else {
		throw new Error("No API Available");
	}
}

// Utility Functions
// --------------------------------------
function securityIconPath(security) {
	return !(security == undefined || security.toUpperCase() == "UNSECURED")
		? NET_LOCK_SRC
		: "";
}

function signalStrengthPath(signalStrength) {
	let iconPath;
	if (signalStrength >= 66) {
		iconPath = NET_STRONG_SRC;
	} else if (signalStrength >= 33) {
		iconPath = NET_MED_SRC;
	} else {
		iconPath = NET_WEAK_SRC;
	}

	return iconPath;
}

function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(response.statusText);
	}
}

function onActiveChanged(network) {
	setAppState((s) => Object.assign({}, s, { activeNetwork: network }));
}

function unsecured() {
	console.log(appState.activeNetwork.security);
	return (
		appState.activeNetwork.security == undefined ||
		appState.activeNetwork.security.toUpperCase() == "UNSECURED"
	);
}

function displaySubmit() {
	return (
		appState.activeNetwork.ssid === undefined ||
		(!unsecured() && !appState.password)
	);
}

function onPasswordChanged(e) {
	setAppState((s) => Object.assign({}, s, { password: e.target.value }));
}
