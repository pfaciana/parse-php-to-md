const getParamNamePrefixed = require('./../getParamNamePrefixed');
const buildDescription = require('./../buildDescription');

function getGlobals(data) {
	let globals = [];

	if (!('tags' in data) || data.tags.length < 1) {
		return globals;
	}

	for (const tag of Object.values(data.tags)) {
		if (['global'].includes(tag.tagName)) {
			globals.push({
				name: getParamNamePrefixed(tag),
				description: buildDescription(tag),
			});
		}
	}

	return globals;
}

function globalsTemplate(data, title = 'Globals') {
	const globals = getGlobals(data);

	if (!globals.length) {
		return '';
	}

	let items = [];

	for (const global of Object.values(globals)) {
		items.push(`#### ${global.name}\n> ${global.description}`);
	}

	return `\n### ${title}\n___\n${items.join('\n')}\n`;
}

module.exports = globalsTemplate;
module.exports.getGlobals = getGlobals;