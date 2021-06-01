const {...fs} = require('fs');
const {normalize, sep, ...path} = require('path');
const deepmerge = require('deepmerge');
const isPlainObject = require('es5-util/js/isPlainObject');
const phpParser = require('parse-php-to-json');
const {getFiles} = phpParser;
const {setDocsRoot, getDocsRoot, getDataRoot} = require('./getPaths');
const processFile = require('./processFile');
const {buildTOC, buildSidebar, buildFooter} = require('./buildMetaPages');

function buildMd(options, callback = null, callbackMd = null) {
	options.include = [getDataRoot()];
	options.dest = normalize(options.dest + sep);
	options.buildSidebar = !('buildSidebar' in options) || options.buildSidebar;
	options.buildTOC = !('buildTOC' in options) || options.buildTOC;
	if (options.buildTOC && typeof options.buildTOC !== 'string') {
		options.buildTOC = 'Home';
	}
	fs.rmSync(options.dest, {force: true, recursive: true});
	buildTOC(options);
	buildSidebar(options);
	buildFooter(options);
	(async () => {
		for await (let filename of getFiles(options)) {
			processFile(filename, options);
		}
		typeof callback === 'function' && callback(options, callbackMd);
	})();
}

function cleanUp(options, callbackMd) {
	if ('deleteJson' in options && options.deleteJson) {
		console.log('Deleting: ' + getDocsRoot());
		fs.rmSync(getDocsRoot(), {force: true, recursive: true});
	}
	typeof callbackMd === 'function' && callbackMd();
}

function run(options, callbackMd = null, callbackJson = null) {
	let src = null;
	if (!('src' in options)) {
		throw 'You must declare a destination for the JSON files';
	}
	if (!('dest' in options) || typeof options.dest !== 'string') {
		throw 'You must declare a destination for the Markdown files';
	}
	if (isPlainObject(options.src)) {
		src = deepmerge({}, options.src);
		options.src = options.src.dest;
	}
	setDocsRoot(options.src);
	if ((!fs.existsSync(getDocsRoot()) || !fs.readdirSync(getDocsRoot()).length) && (!src || !('include' in src) || !src.include)) {
		throw 'You must declare the location of the PHP source files';
	}
	if (src) {
		phpParser(src, function (toc, search) {
			typeof callbackJson === 'function' && callbackJson(toc, search);
			buildMd(options, cleanUp, callbackMd);
		});
	} else {
		buildMd(options, cleanUp, callbackMd);
	}

}

module.exports = run;