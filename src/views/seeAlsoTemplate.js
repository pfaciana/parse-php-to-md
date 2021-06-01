const isPlainObject = require('es5-util/js/isPlainObject');
const {getUrl, getName} = require('./../refInfo');
const {newLineToSpace} = require('./../helpers');

function getAlsoLinks(data) {
	let links = {};

	if (!('tags' in data) || data.tags.length < 1) {
		return links;
	}

	links = {};

	for (const tag of Object.values(data.tags)) {
		if (['link', 'see'].includes(tag.tagName)) {
			let url, text, summary = null;
			if ('type' in tag && tag.type && 'name' in tag && tag.name && isPlainObject(tag.name)) {
				url = getUrl(tag.name.name, tag.type, tag.name.namespace);
				text = getName(tag.name.name, tag.type, tag.name.namespace);
				summary = tag.desc ? newLineToSpace(tag.desc.trim()) : null;
			} else {
				url = 'type' in tag && tag.type ? tag.type : tag.name;
				text = tag.desc ?  newLineToSpace(tag.desc.trim()) : url;
			}

			links[text] = {url};
			summary && (links[text].summary = summary);
		}
	}

	return links;
}

function seeAlsoTemplate(data, title = 'See Also') {
	const links = getAlsoLinks(data);

	if (!Object.keys(links).length) {
		return '';
	}

	let rows = [];

	for (const [text, details] of Object.entries(links)) {
		const summary = 'summary' in details && details.summary ? ' - ' + details.summary : '';
		rows.push(details.url ? `* [${text}](${details.url})${summary}` : `* ${text}${summary}`);
	}

	return `\n### ${title}\n___\n${rows.join('\n')}\n`;
}

module.exports = seeAlsoTemplate;
module.exports.getAlsoLinks = getAlsoLinks;