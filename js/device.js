
function init(deviceId) {
		var flags = document.getElementById("flag-styles");

		if(!config().cloud) {
			flags.sheet.insertRule('.cloud-only { display: none; }');
		}
		if(!config().device) {
			flags.sheet.insertRule('.device-only { display: none; }');
		}

		initDevice(deviceId);
		initParamControls(deviceId);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function hexToCOLOR4F(hex) {
	let rgb = hexToRgb(hex);
	return `${rgb.r/255},${rgb.g/255},${rgb.b/255},1`;
}

async function initParamControls(deviceId) {
	var source = document.getElementById("control-template").innerHTML;
	var template = Handlebars.compile(source);

	var rgbToHex = function (rgb) {
		var hex = Number(rgb).toString(16);
		if (hex.length < 2) {
				hex = "0" + hex;
		}
		return hex;
	};
	var fullColorHex = function(r,g,b) {
			var red = rgbToHex(r);
			var green = rgbToHex(g);
			var blue = rgbToHex(b);
			return red+green+blue;
	};

	let params = await retrieveSlideParameters(deviceId);

	let moddedInputs = params.parameters.map(input =>{
		switch(input.type) {
				case "FLOAT":
					input.float = true;
					break;

				case "BOOLEAN":
					input.bool = true;
					if(input.value == 'yes') {
							input.checked = true;
					}
					break;

				case "VECTOR2":
					input.vec2 = true

					let valueParts2 = input.value.split(',');
					input.value0 = valueParts2[0];
					input.value1 = valueParts2[1];

					let minParts2 = input.minimumValue.split(',');
					input.minimumValue0 = minParts2[0];
					input.minimumValue1 = minParts2[1];

					let maxParts2 = input.maximumValue.split(',');
					input.maximumValue0 = maxParts2[0];
					input.maximumValue1 = maxParts2[1];
					break;

				case "VECTOR3":
					input.vec3 = true

					let valueParts3 = input.value.split(',');
					input.value0 = valueParts3[0];
					input.value1 = valueParts3[1];
					input.value2 = valueParts3[2];

					let minParts3 = input.minimumValue.split(',');
					input.minimumValue0 = minParts3[0];
					input.minimumValue1 = minParts3[1];
					input.minimumValue2 = minParts3[2];

					let maxParts3 = input.maximumValue.split(',');
					input.maximumValue0 = maxParts3[0];
					input.maximumValue1 = maxParts3[1];
					input.maximumValue2 = maxParts3[2];
					break;

				case "COLOR4F":
					input.color = true;
					let colorParts = input.value.split(',');
					// how are the colors in the params formatted?
					input.value = '#' + fullColorHex(Math.round(colorParts[0] * 255), Math.round(colorParts[1] * 255), Math.round(colorParts[2] * 255));
					break;

				case "image":
					input.image = true;

					break;
		}
		return input;
	});

	document.getElementById('control').innerHTML = template({slideName: params.name, INPUTS: moddedInputs});
}

async function initDevice(deviceId) {
	var source = document.getElementById("device-template").innerHTML;
	var template = Handlebars.compile(source);

	let response = await retrieveDevice(deviceId);
	let json = response.body;

	let merged = {...json, ...json._embedded.info};

	if(merged.offlineSince != null) {
		merged.statusImg = 'img/offline.svg';
		merged.offlineSince = new Date(merged.offlineSince).toLocaleString();
	} else {
		merged.statusImg = 'img/online.svg';
	}

	merged.refreshRate = Math.round(merged.refreshRate);

	document.getElementById('device').innerHTML = template(merged);
}

function onRemoveSafety() {
    document.getElementById('deregister-safety').style.display = "none";
    document.getElementById('deregister-trigger').style.display = "block";
}

function deregisterDevice(deviceId) {
    fetch(`${config().apiUrl}/devices/${deviceId}`, {
        method: 'delete',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => {
        window.location.href = 'account.html';
    });
}
