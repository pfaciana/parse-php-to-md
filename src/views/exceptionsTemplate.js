const {newLineToSpace} = require('./../helpers');

function getExceptions(data) {
	let exceptions = [];

	if (!('tags' in data) || data.tags.length < 1) {
		return exceptions;
	}

	for (const tag of Object.values(data.tags)) {
		if (['deprecated'].includes(tag.tagName)) {
			exceptions.push('> Deprecated' + (tag.type ? ' since version ' + tag.type : '') + (tag.desc ? '  \n> ' + newLineToSpace(tag.desc) : ''));
		}
	}

	return exceptions;
}

function exceptionsTemplate(data, title = 'Deprecated') {
	const exceptions = getExceptions(data);

	if (!exceptions.length) {
		return '';
	}

	return `\n### ${title}\n___\n${exceptions.join('\n\n')}\n`;
}

module.exports = exceptionsTemplate;
module.exports.getExceptions = getExceptions;