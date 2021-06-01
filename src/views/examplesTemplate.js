function getExamples(data) {
	let examples = [];

	if (!('tags' in data) || data.tags.length < 1) {
		return examples;
	}

	for (const tag of Object.values(data.tags)) {
		if (['example'].includes(tag.tagName) && 'desc' in tag && tag.desc) {
			examples.push(tag.desc.replaceAll("\\n", '<br>').replaceAll("\n", '<br>').replaceAll("\t", '&nbsp;&nbsp;&nbsp;&nbsp;').trim());
		}
	}

	return examples;
}

function examplesTemplate(data, title = 'Examples') {
	const examples = getExamples(data);

	if (!examples.length) {
		return '';
	}

	let rows = [];

	for (const [index, code] of Object.entries(examples)) {
		rows.push(`#### Example #${+index + 1}`);
		rows.push('```php\n' + code + '\n```');
	}

	return `\n### ${title}\n___\n${rows.join('\n')}\n`;
}

module.exports = examplesTemplate;
module.exports.getExamples = getExamples;