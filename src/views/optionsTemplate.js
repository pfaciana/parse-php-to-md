const {newLineToSpace} = require('./../helpers');

function getOptions(data) {
	let options = {};

	if (!('tags' in data) || data.tags.length < 1) {
		return options;
	}

	options = {
		keys: ['Tag', 'Summary'],
		data: [],
	};

	for (const tag of Object.values(data.tags)) {
		if (['author', 'copyright', 'license', 'category', 'package', 'subpackage'].includes(tag.tagName)) {
			const summary = newLineToSpace(tag.desc ?? '') + (tag.type ? ' - ' + tag.type : '');
			options.data.push(['@' + tag.tagName, summary.replace('|', '-')]);
		}
	}

	return options;
}

function optionTemplate(row) {
	let columns = [];

	for (let column of Object.values(row)) {
		if (typeof column === 'boolean') {
			column = column ? 'Yes' : 'No';
		}
		columns.push(column);
	}

	return `|${columns.join('|')}|`;
}

function optionsTemplate(data, title = 'Options') {
	const options = getOptions(data);

	if (!('data' in options) || !options.data.length) {
		return '';
	}

	const headers = 'keys' in options ? options.keys : Object.keys(options.data[0]);

	const header = `|${headers.join('|')}|\n|${Array(headers.length).fill('---').join('|')}|`;

	let rows = [];

	for (const row of Object.values(options.data)) {
		rows.push(optionTemplate(row));
	}

	return `\n### ${title}\n___\n\n${header}\n${rows.join('\n')}\n`;
}

module.exports = optionsTemplate;
module.exports.optionTemplate = optionTemplate;
module.exports.getOptions = getOptions;