let serviceClient = {

	retrieveDevice: async function (deviceId) {
  		const [displayState, deviceConfig, networkState, firmwareState, playbackState] = await Promise.all([
    		serviceClient.retrieveDisplayState(),
    		serviceClient.retrieveDeviceConfig(),
    		serviceClient.retrieveNetworkState(),
    		serviceClient.retrieveFirmwareState(),
    		serviceClient.retrievePlaybackState()
  		]);

  		let display = displayState.body;
  		let config = deviceConfig.body;
  		let network = networkState.body;
  		let firmware = firmwareState.body;
  		let playback = playbackState.body;

  		let embeddedInfo = {
  			hResolution : display.resolution.hactive,
  			vResolution : display.resolution.vactive,
  			refreshRate : display.resolution.refreshRate,
  			cableStatus : display.cableStatus,

  			location : 	config.location,
  			partNumber: config.partNumber,
  			manufacturedAt: config.manufactured,

  			hostname: network.hostname,

  			firmwareVersion: firmware.currentVersion,
  			availableFirmwareVersion: firmware.availableVersion,

  			brightness : playback.globalBrightness,
  			status : playback.status
  		};

		let body = {
			name: deviceConfig.body.name,
			serialNumber: deviceConfig.body.serialNumber,
			_embedded: {
				info: embeddedInfo
			}
		}	
			
		return {
			body: body
		};
	},	

	retrievePlaybackParameters: async function (deviceId) {
		let response = await 
			fetch(`${config.apiUrl}/playbackParameters`);

		return {
			response: response,
			body: await response.json()
		};
	},

	retrieveDisplayState: async function (deviceId) {
		let response = await 
			fetch(`${config.apiUrl}/displayState`);

		return {
			response: response,
			body: await response.json()
		};
	},

	retrieveDeviceConfig: async function () {
		let response = await 
			fetch(`${config.apiUrl}/deviceConfig`);

		return {
			response: response,
			body: await response.json()
		};
	},

	retrieveFirmwareState: async function () {
		let response = await 
			fetch(`${config.apiUrl}/firmwareState`);

		return {
			response: response,
			body: await response.json()
		};
	},

	retrieveNetworkState: async function () {
		let response = await 
			fetch(`${config.apiUrl}/networkState`);

		return {
			response: response,
			body: await response.json()
		};
	},

	retrievePlaybackState: async function () {
		let response = await 
			fetch(`${config.apiUrl}/playbackState`);

		return {
			response: response,
			body: await response.json()
		};
	},

	play: async function (deviceSn) {
		return await this.rpcRequest(deviceSn, 'play', null);
	},

	pause: async function (deviceSn) {
		return await this.rpcRequest(deviceSn, 'pause', null);
	},

	stop: async function (deviceSn) {
		return await this.rpcRequest(deviceSn, 'stop', null);
	},

	rpcRequest: async function (deviceSn, method, params) {
		let rand = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
		let body = {
			jsonrpc: '2.0',
			id: rand.toString(),
			method: method
		}

		if (params) {
			body.params = params;
		}

		let httpResponse = await 
			fetch(`${config.apiUrl}/rpc`, {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(body)
			});

		return await httpResponse.json();
	},

	setParameter: function (deviceSn, name, slideName, value, type) {
		return this.rpcRequest(deviceSn, 'setParameterValue', {
			name: name,
			slideName: slideName,
			value: value.toString(),
			type: type
		});
	}
}
