const getParamNamePrefixed = require('./../getParamNamePrefixed');
const getModifierList = require('./../getModifierList');
const buildParams = require('./../buildParams');
const buildDescription = require('./../buildDescription');
const buildProperty = require('./../buildProperty');
const buildPropertyField = require('./../buildPropertyField');
const buildSignature = require('./../buildSignature');

function getSignature(data, params, returns) {
	if (['classes', 'traits', 'interfaces'].includes(data.type)) {
		return '';
	}

	const modifiers = getModifierList(data, data.visibility ?? null);

	if (['constants', 'properties'].includes(data.type)) {
		const [types, value] = buildProperty(data);
		return buildPropertyField(data.name, types, value, modifiers, null, data.type === 'constants');
	}

	return buildSignature(data.name, params, returns, modifiers);
}

function getParameters(params) {
	let parameters = [];

	for (const param of Object.values(params)) {
		parameters.push({
			name: getParamNamePrefixed(param, null),
			description: buildDescription(param),
		});
	}

	return parameters;
}

function getReturns(returns) {
	return returns ? buildDescription(returns) : null;
}

function descriptionTemplate(data) {
	let params = buildParams(data);
	const description = data.description;
	const signature = getSignature(data, ...params);
	const parameters = getParameters(params[0]);
	const returns = getReturns(params[1]);

	let content = '';

	if (description || (signature && data.type && !['classes', 'traits', 'interfaces'].includes(data.type))) {
		content += `\n### Description\n___\n`;
	}

	if (signature && data.type && !['classes', 'traits', 'interfaces'].includes(data.type)) {
		content += `\n\`\`\`php\n${signature}\n\`\`\`\n`;
	}

	if (description) {
		content += `\n${description}\n`;
	}

	if (signature && data.type && ['classes', 'traits', 'interfaces'].includes(data.type)) {
		content += `\n\`\`\`php\n${signature}\n\`\`\`\n`;
	}

	if (parameters.length) {
		let items = [];
		for (const parameter of Object.values(parameters)) {
			items.push(`#### ${parameter.name}\n> ${parameter.description}`);
		}
		content += `\n### Parameters\n___\n${items.join('\n')}\n`;
	}

	if (returns) {
		content += `\n### Returns\n___\n${returns}\n`;
	}

	return content.trim();
}

module.exports = descriptionTemplate;
module.exports.getSignature = getSignature;
module.exports.getParameters = getParameters;
module.exports.getReturns = getReturns;