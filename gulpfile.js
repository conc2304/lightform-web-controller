const { watch, series, src, dest } = require("gulp");

const customElementsSrc = "web-components/dist/custom-elements/index.js";

const devicesDest = "www/device/js/custom-elements/";
const webComponentDests = [devicesDest];

function watchComponents(cb) {
	copyToDestinations();
	watch(customElementsSrc, { events: "all" }, function () {
		copyToDestinations();
	});
	cb();
}

function copyToDestinations() {
	for (destination of webComponentDests) {
		console.log("Copy to : ", destination);
		src(customElementsSrc).pipe(dest(destination));
	}
}

function defaultTask(cb) {
	watchComponents();
	cb();
}

exports["watch:wc"] = watchComponents;
exports.default = defaultTask;
