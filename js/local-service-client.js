let serviceClient = {

	retrieveDevice: async function (deviceId) {
		let eventualSettings = fetch(`${config().apiUrl}:7340/settings`);
		let eventualInfo = fetch(`${config().apiUrl}:7340/info`);
		let settings = await eventualSettings.then(response => response.json());
		let info = await eventualInfo.then(response => response.json());

		let embeddedInfo = {...settings.data, ...info.data};

		try{
			let resolutionSplit = embeddedInfo.resolution.split("x");
			embeddedInfo.hResolution = resolutionSplit[0];
			let resAndFps = resolutionSplit[1].split("@");
			embeddedInfo.vResolution = resAndFps[0];
			embeddedInfo.refreshRate = resAndFps[1];
		} catch(e) {
			embeddedInfo.hResolution = 0;
			embeddedInfo.vResolution = 0;
			embeddedInfo.refreshRate = "";
		}

		switch(settings.data.cableStatus) {
			case "plugin":
				embeddedInfo.cableStatus = 'PluggedIn';
				break;
			case "plugout":
				embeddedInfo.cableStatus = 'Unplugged';
				break;
			default:
				embeddedInfo.cableStatus = 'Unknown';
		}

		embeddedInfo.firmwareVersion = info.data.currentVersion;

		embeddedInfo.manufacturedAt = info.data.manufactureDate;

		let body = {
			name: info.data.name,
			serialNumber: info.data.serialNumber,
			_embedded: {
				info: embeddedInfo
			}
		}

		return {
			response: await eventualInfo,
			body: body
		};
	},

	retrieveSlideParameters: async function (deviceId) {
		let settings = await fetch(`${config().apiUrl}:7340/settings`).then(response => response.json());

		// this is problematic, we don't know the current slide name so we can't get the current slide params
		let slideName = Object.keys(settings.data.playbackParameters.slides)[settings.data.playbackSlide];
		return {
			name: slideName,
			parameters: settings.data.playbackParameters.slides[slideName]
		}
	},

	setParameter: async function (name, slideName, value, type) {
		return await fetch(`${config().apiUrl}:7341/control/playback/command`, {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				commands: [{
					name: name,
					slideName: slideName,
					value: value.toString(),
					type: type
				}]
			})
		});
	}

}
