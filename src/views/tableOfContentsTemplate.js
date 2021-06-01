const {ucfirst} = require('./../helpers');
const {getUrl} = require('./../refInfo');
const {newLineToSpace} = require('./../helpers');

function getList(links, title) {
	let items = [];

	for (const [text, details] of Object.entries(links)) {
		const summary = 'summary' in details && details.summary ? ' - ' + details.summary : '';
		items.push(newLineToSpace(`* [${text}](${details.url})${summary}`));
	}

	return `\n### ${title}\n___\n${items.join('\n')}\n`;
}

function getTableOfContents(data) {
	if (!['classes', 'traits', 'interfaces'].includes(data.type)) {
		return '';
	}

	let content = '';

	const sortTypes = ['constants', 'properties', 'methods'];

	for (const type of Object.values(sortTypes)) {
		if (type in data && Object.keys(data[type]).length) {
			let links = {};
			for (const [name, details] of Object.entries(data[type])) {
				(links[name] ??= {}).url = getUrl([data.name, details.name], type, data.ns);
				details.summary && (links[name].summary = details.summary);
			}
			content += getList(links, ucfirst(type));
		}
	}

	return content.trim();
}

function tableOfContentsTemplate(data, title = 'Table of Contents') {
	const toc = getTableOfContents(data);

	return toc ? `\n## ${title}\n___\n${toc}\n` : '';
}

module.exports = tableOfContentsTemplate;
module.exports.getTableOfContents = getTableOfContents;
module.exports.getList = getList;