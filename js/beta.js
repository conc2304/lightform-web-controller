function betaFeaturesEnabled() {
	return window.localStorage.getItem('betaFeatures') == "true";
}

function toggleBetaFeaturesEnabled() {
	window.localStorage.setItem('betaFeatures', !betaFeaturesEnabled());
}

function disableBetaInputs() {
	if(!betaFeaturesEnabled()){
		let betaInputs = document.getElementsByClassName("beta-input");
		for(var i = 0; i < betaInputs.length; i++) {
			betaInputs[i].disabled = true;
			betaInputs[i].title = "Enable beta features from the account page.";
		}
	}

	hideBetaElements();
}

function hideBetaElements() {
	if(!betaFeaturesEnabled()){
		var flags = document.getElementById("flag-styles");
		flags.sheet.insertRule('.beta-show { display: none; }');
	}
}

