
function init(deviceId) {
	var flags = document.getElementById("flag-styles");

	if (!config.cloud) {
		flags.sheet.insertRule('.cloud-only { display: none; }');
	}
	if (!config.device) {
		flags.sheet.insertRule('.device-only { display: none; }');
	}

	let eventuallyInitDevice = initDevice(deviceId);
	let inits = [eventuallyInitDevice]

	inits.push(
		eventuallyInitDevice
			.then(device =>
				initParamControls(deviceId, device)
			)
	);

    Promise.all(inits).then(_ => {
		disableBetaInputs();
	});
}

function showError(message) {
	let errorText = document.getElementById('request-warning-text');
	let errorElem = document.getElementById('request-warning');

	errorText.innerText = message;
	errorElem.style.display = "block";
}

function hideError() {
	document.getElementById('request-warning').style.display = "none";
}

function onPlay(deviceSn) {
	hideError();
	serviceClient.play(deviceSn)
		.then(response => {
			if (response.error) {
				showError(`Unable to play slide: ${response.error.message}`);
			}
		});
}

function onPause(deviceSn) {
	hideError();
	serviceClient.pause(deviceSn)
		.then(response => {
			if (response.error) {
				showError(`Unable to pause slide: ${response.error.message}`);
			}
		});
}

function onStop(deviceSn) {
	hideError();
	serviceClient.stop(deviceSn)
		.then(response => {
			if (response.error) {
				showError(`Unable to stop project: ${response.error.message}`);
			}
		});
}

function onNext(deviceSn) {
	hideError();
	serviceClient.rpcRequest(deviceSn, 'nextSlide', null)
		.then(response => {
			if (response.error) {
				showError(`Unable to go to next slide: ${response.error.message}`);
			}
		});
}

function onPrev(deviceSn) {
	hideError();
	serviceClient.rpcRequest(deviceSn, 'prevSlide', null)
		.then(response => {
			if (response.error) {
				showError(`Unable to go to last slide: ${response.error.message}`);
			}
		});
}

function onReboot(deviceSn) {
	hideError();
	serviceClient.rpcRequest(deviceSn, 'reboot', null)
		.then(response => {
			if (response.error) {
				showError(`Unable to restart device: ${response.error.message}`);
			} else {
				location.reload();
			}
		});
}

function onUpdateBrightness(deviceSn, brightness) {
	hideError();
	serviceClient.rpcRequest(deviceSn, 'setGlobalBrightness', { brightness: Number(brightness) })
		.then(response => {
			if (response.error) {
				showError(`Unable to set brightness: ${response.error.message}`);
			}
		});
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function rgbToHex(r, g, b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);

	if (r.length == 1)
		r = "0" + r;
	if (g.length == 1)
		g = "0" + g;
	if (b.length == 1)
		b = "0" + b;

	return "#" + r + g + b;
}

function rgb2hsv_wiki(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	let v = Math.max(r, g, b);
	let i = Math.min(r, g, b);
	let n = v - i;
	let s = v ? n / v : 0;
	let h = 0;
	if (n) {
		if (v == r) h = 60 * (0 + (g - b) / n);
		if (v == g) h = 60 * (2 + (b - r) / n);
		if (v == b) h = 60 * (4 + (r - g) / n);
	} else h = 0;

	return { h: (h + 360) % 360, s: s, v: v };
}

// where s & v in [0, 1]
function hsvToRgb(h, s, v) {

	function f(n) {
		let k = (n + h / 60) % 6;
		return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	}

	let r = Math.floor(Math.max(Math.min(f(5) * 256, 255), 0));
	let g = Math.floor(Math.max(Math.min(f(3) * 256, 255), 0));
	let b = Math.floor(Math.max(Math.min(f(1) * 256, 255), 0));

	return { r: r, g: g, b: b };
}

function hexToHueSat(hex) {
	let rgb = hexToRgb(hex);
	let hsv = rgb2hsv_wiki(...Object.values(rgb));
	return `${hsv.h / 360},${hsv.s}`;
}

function hexToCOLOR4F(hex) {
	let rgb = hexToRgb(hex);
	return `${rgb.r / 255},${rgb.g / 255},${rgb.b / 255},1`;
}

function flattenLightnessValue(hex) {
	let rgb = hexToRgb(hex);
	let hsv = rgb2hsv_wiki(...Object.values(rgb));
	hsv.v = 1;
	rgb = hsvToRgb(...Object.values(hsv));
	hex = rgbToHex(...Object.values(rgb));
	return hex;
}

async function initParamControls(deviceId, device) {
	var params = (await serviceClient.retrievePlaybackParameters(deviceId)).body;
	params.slides.forEach(slide =>
		slide.parameters.forEach(input => {
			switch (input.type) {

				case "FLOAT":
					input.float = true;
					break;

				case "BOOLEAN":
					input.bool = true;
					if (input.value == 'yes') {
						input.checked = true;
					}
					break;

				case "VECTOR2":
					switch (input.controlType) {
						case "HUE_SATURATION":
							input.hueSaturation = true;
							let colorParts2 = input.value.split(',');
							input.hex = rgbToHex(...Object.values(hsvToRgb(360 * colorParts2[0], colorParts2[1], 1)));
							break;
						default:
							input.vec2 = true;
							let valueParts2 = input.value.split(',');
							input.value0 = valueParts2[0];
							input.value1 = valueParts2[1];

							let minParts2 = input.minValue.split(',');
							input.minValue0 = minParts2[0];
							input.minValue1 = minParts2[1];

							let maxParts2 = input.maxValue.split(',');
							input.maxValue0 = maxParts2[0];
							input.maxValue1 = maxParts2[1];
					};
					break;

				case "VECTOR3":
					input.vec3 = true;

					let valueParts3 = input.value.split(',');
					input.value0 = valueParts3[0];
					input.value1 = valueParts3[1];
					input.value2 = valueParts3[2];

					let minParts3 = input.minValue.split(',');
					input.minValue0 = minParts3[0];
					input.minValue1 = minParts3[1];
					input.minValue2 = minParts3[2];

					let maxParts3 = input.maxValue.split(',');
					input.maxValue0 = maxParts3[0];
					input.maxValue1 = maxParts3[1];
					input.maxValue2 = maxParts3[2];
					break;
			};
		})
	);

	params.serialNumber = deviceId;

	if (!betaFeaturesEnabled()) {
		params.beta = true;
	}

	params.brightness = device._embedded.info.brightness;

	var source = document.getElementById("control-template-cloud").innerHTML;
	var template = Handlebars.compile(source);
	document.getElementById('control-cloud').innerHTML = template(params);
}

async function initDevice(deviceId) {
	var source = document.getElementById("device-template").innerHTML;
	var template = Handlebars.compile(source);

	let response = await serviceClient.retrieveDevice(deviceId);

	if (response.response.status == 403) {
		window.location.href = "account.html";
	}

	let json = response.body;

	document.title = `${json.name} - Lightform Cloud`;

	let merged = { ...json, ...json._embedded.info };

	if (merged.offlineSince != null) {
		merged.statusImg = 'img/offline.svg';
		merged.offlineSince = new Date(merged.offlineSince).toLocaleString();
	} else {
		merged.statusImg = 'img/online.svg';
	}

	merged.refreshRate = Math.round(merged.refreshRate);
	if (!betaFeaturesEnabled()) {
		merged.beta = true;
	}

	document.getElementById('device').innerHTML = template(merged);
	return json;
}

function onRemoveSafety() {
	document.getElementById('deregister-safety').style.display = "none";
	document.getElementById('deregister-trigger').style.display = "block";
}

function deregisterDevice(deviceId) {
	fetch(`${config.apiUrl}/devices/${deviceId}`, {
		method: 'delete',
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
		}
	})
		.then(response => {
			window.location.href = 'account.html';
		});
}

async function onUpdateParameter(deviceSn, name, slideName, value, type) {
	hideError();

	let response = await serviceClient.setParameter(deviceSn, name, slideName, value, type);

	if (response.error) {
		showError(`Unable to update ${name} on slide ${slideName}: ${response.error.message}`);
	}
}
