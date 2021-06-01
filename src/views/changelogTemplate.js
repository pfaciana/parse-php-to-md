const {newLineToSpace, uksort, version_compare} = require('./../helpers');

function getChangelog(data) {
	let changelog = {};

	if (!('tags' in data) || data.tags.length < 1) {
		return changelog;
	}

	changes = {};

	for (const tag of Object.values(data.tags)) {
		if (['since', 'version', 'change'].includes(tag.tagName)) {
			const version = (tag.tagName === 'since' ? tag.type : tag.desc) ?? null;
			const summary = tag.tagName === 'since' && tag.desc.trim() ? tag.desc.trim() : '@' + tag.tagName;
			changes[version] = newLineToSpace(summary);
		}
	}

	changes = uksort(changes, version_compare);

	for (const tag of Object.values(data.tags)) {
		if (['date'].includes(tag.tagName)) {
			const version = (tag.tagName === 'since' ? tag.type : tag.desc) ?? null;
			const summary = tag.tagName === 'since' && tag.desc.trim() ? tag.desc.trim() : '@' + tag.tagName;
			changes[version] = newLineToSpace(summary);
		}
	}

	return changes;
}

function changelogTemplate(data, title = 'Changelog') {
	const changelog = getChangelog(data);

	if (!Object.keys(changelog).length) {
		return '';
	}

	const headers = ['Version', 'Description'];

	const header = `|${headers.join('|')}|\n|${Array(headers.length).fill('---').join('|')}|`;

	let rows = [];

	for (const columns of Object.entries(changelog)) {
		rows.push(`|${columns.join('|')}|`);
	}

	return `\n### ${title}\n___\n\n${header}\n${rows.join('\n')}\n`;
}

module.exports = changelogTemplate;
module.exports.getChangelog = getChangelog;