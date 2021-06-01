const isPlainObject = require('es5-util/js/isPlainObject');
const {getUrl, getName} = require('./../refInfo');
const {newLineToSpace} = require('./../helpers');

function getUsages(data) {
	let usages = {};

	if (!('tags' in data) || data.tags.length < 1) {
		return usages;
	}

	usages = {};

	for (const tag of Object.values(data.tags)) {
		if (['uses'].includes(tag.tagName)) {
			const url = getUrl(tag.name.name, tag.type, tag.name.namespace);
			const text = getName(tag.name.name, tag.type, tag.name.namespace);
			const summary = tag.desc ? tag.desc.trim() : null;
			(usages['Uses'] ??= {})[text] = {url};
			summary && (usages['Uses'][text].summary = summary);
		}
	}

	for (const tag of Object.values(data.tags)) {
		if (['used-by'].includes(tag.tagName)) {
			const url = getUrl(tag.name.name, tag.type, tag.name.namespace);
			const text = getName(tag.name.name, tag.type, tag.name.namespace);
			const summary = tag.desc ? tag.desc.trim() : null;
			(usages['Used By'] ??= {})[text] = {url};
			summary && (usages['Used By'][text].summary = summary);
		}
	}

	for (const tag of Object.values(data.tags)) {
		if (['tutorial'].includes(tag.tagName)) {
			const summary = tag.desc ? tag.desc.trim() : null;
			summary && ((usages['Tutorials'] ??= []).push(summary));
		}
	}

	return usages;
}

function usageTemplate(data, title = 'Usage') {
	const usages = getUsages(data);

	if (!Object.keys(usages).length) {
		return '';
	}

	let rows = [];

	for (const [header, items] of Object.entries(usages)) {
		rows.push(`#### ${header}`);
		for (const [text, details] of Object.entries(items)) {
			const summary = 'summary' in details && details.summary ? ' - ' + details.summary : '';
			rows.push(newLineToSpace(`* [${text}](${details.url})${summary}`));
		}
	}

	return `\n### ${title}\n___\n${rows.join('\n')}\n`;
}

module.exports = usageTemplate;
module.exports.getUsageLinks = getUsages;