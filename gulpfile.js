const { watch, series, src, dest } = require("gulp");
const replace = require("gulp-replace");

const customElementsSrc = "web-components/dist/custom-elements/index.js";

const devicesDest = "www/device/js/custom-elements/";
const webControllerDest = "web-controller/src/assets/js/custom-elements/"
const webComponentDests = [devicesDest, webControllerDest];

function watchComponents(cb) {
	copyToDestinations();
	watch(customElementsSrc, { events: "all" }, function () {
		copyToDestinations(cb);
	});
	cb();
}

function copyToDestinations(cb) {
	// search for the unexported method name aliased as defineCustomElements in the custom elements bundle, append it to file to be called on load
	// it is expected that this search regex final portion of the file
	const searchRe = /((\w+) as defineCustomElements.+})/;
	const replaceRe = "$1 \r\n$2();";

	for (destination of webComponentDests) {
		console.log("Copying to : ", destination);
		src(customElementsSrc)
			.pipe(replace(searchRe, replaceRe))
			.pipe(dest(destination));
	}
	cb();
}

function defaultTask(cb) {
	watchComponents();
	cb();
}

exports["watch:wc"] = watchComponents;
exports["copy:wc"] = copyToDestinations;
exports.default = defaultTask;
