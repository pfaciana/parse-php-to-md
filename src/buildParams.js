const isset = require('es5-util/js/isSetLoose');
const deepmerge = require('deepmerge');
const {array_unique} = require('./helpers');

function buildParams(data) {
	let returns = null, params = [], paramTags = [], baseParam = {desc: '', optional: false, type: []};

	for (const tag of Object.values(data.tags)) {
		if (tag.tagName === 'param') {
			tag.type = tag.type.map(type => type.replace(/[^A-Za-z0-9-_[]]/, ''));
			paramTags.push({...tag});
		}
	}

	if ('arguments' in data && data.arguments.length) {
		const paramTagNames = paramTags.map(tag => tag.name);
		for (const arg of Object.values(data.arguments)) {
			const index = paramTagNames.indexOf(arg.name);
			if (index !== -1) {
				delete paramTags[index].name;
				const param = deepmerge(arg, paramTags[index], {
					arrayMerge: (dest, src) => [...dest, ...src],
				});
				param.type && (param.type = array_unique(param.type));
				isset(param.value) && (param.optional = true);
				params.push(param);
				delete paramTags[index];
			} else {
				isset(arg.value) && (arg.optional = true);
				const param = deepmerge(baseParam, arg, {
					arrayMerge: (dest, src) => [...dest, ...src],
				});
				params.push(param);
			}
		}
	}

	for (const [index, tag] of Object.entries(paramTags)) {
		params.push(tag);
		delete paramTags[index];
	}

	for (const tag of Object.values(data.tags)) {
		if (tag.tagName === 'return') {
			returns = tag;
		}
	}

	return [params, returns];
}

module.exports = buildParams;