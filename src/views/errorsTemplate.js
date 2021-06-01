function getErrors(data) {
	let errors = {};

	if (!('tags' in data) || data.tags.length < 1) {
		return errors;
	}

	for (const tag of Object.values(data.tags)) {
		if (['throws'].includes(tag.tagName)) {
			errors[tag.type] = tag.desc;
		}
	}

	return errors;
}

function errorsTemplate(data, title = 'Throws') {
	const errors = getErrors(data);

	if (!Object.keys(errors).length) {
		return '';
	}

	let rows = [];

	for (const [name, summary] of Object.entries(errors)) {
		rows.push(`<dt>${name}</dt><dd>${summary}</dd>`);
	}

	return `\n### ${title}\n___\n<dl>\n${rows.join('\n')}\n</dl>\n`;
}

module.exports = errorsTemplate;
module.exports.getErrors = getErrors;