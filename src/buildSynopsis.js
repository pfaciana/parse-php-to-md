const isPlainObject = require('es5-util/js/isPlainObject');
const buildProperty = require('./buildProperty');
const buildPropertyField = require('./buildPropertyField');
const buildParams = require('./buildParams');
const buildSignature = require('./buildSignature');

function buildSynopsis(data) {
	const types = {
		classes: 'class',
		traits: 'trait',
		interfaces: 'interface',
	};

	const getNamespace = () => {
		if (!data.ns.length) {
			return '';
		}
		return `namespace ${data.ns.join('\\')};\n\n`;
	};
	const isFinal = () => data.isFinal ? 'final ' : '';
	const isAbstract = () => data.isAbstract ? 'abstract ' : '';
	const getExtends = () => {
		if (!('extends' in data) || !data.extends) {
			return '';
		}
		let extend = Array.isArray(data.extends) ? data.extends[0] : data.extends;
		extend = isPlainObject(extend) && 'name' in extend ? extend.name : extend;
		return extend ? ` extends ${extend}` : '';
	};
	const getImplements = () => {
		if (!('implements' in data) || !data.implements.length) {
			return '';
		}
		return ` implements ${data.implements.join(', ')}`;
	};
	const getTraitAdaptations = () => {
		if (!('traits' in data) || !('adaptations' in data.traits) || !Object.keys(data.traits.adaptations).length) {
			return '';
		}

		const adaptations = Object.entries(data.traits.adaptations).map(([name, details]) => {
			return `\t\t${name} from ${details.use}${details.method ? '::' + details.method : ''};`;
		});

		return ` {\n${adaptations.join('\n')}\n\t}`;
	};
	const getTraits = () => {
		if (!('traits' in data) || !('use' in data.traits || !Object.keys(data.traits.use).length)) {
			return '';
		}

		return `\t/* Traits */\n\tuse ${Object.keys(data.traits.use).join(', ')}${getTraitAdaptations()};\n`;
	};
	const getConstants = () => {
		if (!('constants' in data) || !Object.keys(data.constants).length) {
			return `/* No Public Constants */\n`;
		}

		const constants = Object.entries(data.constants).map(([name, details]) => {
			const [types, value] = buildProperty(details);
			return `\t${buildPropertyField(name, types, value, details.modifiers, null, true)}`;
		});

		return `/* Public Constants */\n${constants.join('\n')}\n`;
	};
	const getProperties = () => {
		if (!('properties' in data) || !Object.keys(data.properties).length) {
			return `/* No Public Properties */\n`;
		}

		const properties = Object.entries(data.properties).map(([name, details]) => {
			const [types, value] = buildProperty(details);
			return `\t${buildPropertyField(name, types, value, details.modifiers)}`;
		});

		return `/* Public Properties */\n${properties.join('\n')}\n`;
	};
	const getMethods = () => {
		if (!('methods' in data) || !Object.keys(data.methods).length) {
			return `/* No Public Methods */\n`;
		}

		const methods = Object.entries(data.methods).map(([name, details]) => {
			const [params, returns] = buildParams(details);
			return `\t${buildSignature(name, params, returns, details.modifiers)} { }`;
		});

		return `/* Public Methods */\n${methods.join('\n')}\n`;
	};

	return `\n\`\`\`php
${getNamespace()}${isFinal()}${isAbstract()}${types[data.type]} ${data.name}${getExtends()} {

${getTraits()}

	${getConstants()}

	${getProperties()}

	${getMethods()}
}	
\`\`\`\n`.replaceAll('\n\n\n', '\n\n').replaceAll('\n\n\n', '\n\n').replaceAll('\t', '  ');
}

module.exports = buildSynopsis;