const {normalize, sep, ...path} = require('path');

let dataRoot = null, docsRoot = null;

function setDataRoot(dir) {
	return dataRoot = normalize(dir + sep);
}

function getDataRoot(path = '') {
	return dataRoot + path;
}

function setDocsRoot(dir, saveDataRoot = true) {
	saveDataRoot && setDataRoot(normalize(dir + sep + 'data' + sep))
	return docsRoot = normalize(dir + sep);
}

function getDocsRoot(path = '') {
	return docsRoot + path;
}

module.exports.setDataRoot = setDataRoot;
module.exports.getDataRoot = getDataRoot;
module.exports.setDocsRoot = setDocsRoot;
module.exports.getDocsRoot = getDocsRoot;