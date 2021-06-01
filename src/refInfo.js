const fs = require('fs');
const {normalize, sep, ...path} = require('path');
const {getDataRoot} = require('./getPaths');
const getFiles = require('./getFiles');

const types = {
	class: 'classes',
	trait: 'traits',
	interface: 'interfaces',
	property: 'properties',
	constant: 'constants',
	function: 'functions',
	method: 'methods',
};

function getFile(type, ns, name) {
	const paths = [getDataRoot(), ns.join(sep)];
	const filenames = ['constants', 'properties', 'methods'].includes(type) ? ['classes', 'traits', 'interfaces'] : [type];
	const attr = Array.isArray(name) && name.length > 1 ? name[1] : null;
	name = Array.isArray(name) && name.length > 0 ? name[0] : name;

	for (const filename of Object.values(filenames)) {
		const filePath = normalize([...paths, (types[filename] ?? filename)].filter(x => x).join(sep) + '.json');
		if (fs.existsSync(filePath)) {
			const response = JSON.parse(fs.readFileSync(filePath));
			if (name in response) {
				if (!attr || attr in ((response[name][(types[type] ?? type)] ??= {}).public ??= {})) {
					return filePath;
				}
				return false;
			}
		}
	}

	return false;
}

function getUrl(name, type, ns, validateFile = true) {
	if (validateFile) {
		const filename = getFile(type, ns, name);
		if (!filename) {
			return false;
		}
	}

	const attr = Array.isArray(name) && name.length > 1 ? name[1] : null;
	name = Array.isArray(name) && name.length > 0 ? name[0] : name;

	let url = [...ns, name].filter(x => x).join('_');

	attr && (url += `~${type === 'properties' ? '$' : ''}${attr}`);

	return url;
}

function getPath(name, type, ns) {
	const attr = Array.isArray(name) && name.length > 1 ? name[1] : null;
	name = Array.isArray(name) && name.length > 0 ? name[0] : name;

	name = [...ns, name].filter(x => x).join('_');

	let location = [...ns, name].filter(x => x).join(sep);

	attr && (location += `~${type === 'properties' ? '$' : ''}${attr}`);

	return location + '.md';
}

function getName(name, type, ns = []) {
	const attr = Array.isArray(name) && name.length > 1 ? name[1] : null;
	name = Array.isArray(name) && name.length > 0 ? name[0] : name;

	let fullName = (ns.length ? '\\' : '') + [...ns, name].filter(x => x).join('\\');

	attr && (fullName += `::${type === 'properties' ? '$' : ''}${attr}`);

	return fullName;
}

module.exports.getFile = getFile;
module.exports.getUrl = getUrl;
module.exports.getPath = getPath;
module.exports.getName = getName;