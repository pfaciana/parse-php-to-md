const getParamNamePrefixed = require('./getParamNamePrefixed');
const {getWrappedVarTypes} = require('./getVarTypes');
const getParamDefault = require('./getParamDefault');
const {newLineToSpace, var_export} = require('./helpers');

function getDescription(param) {
	let content = '';

	if (param.desc) {
		if (typeof param.desc !== 'object') {
			content += newLineToSpace(param.desc);
		} else if ('tags' in param.desc && param.desc.tags.length) {
			content += buildParamTable(param.desc.tags, true);
		}
	}
	if ('optional' in param) {
		param.optional = true;
	}

	const [hasDefault, defaultValue] = getParamDefault(param);

	hasDefault && (content += ` **Default: ${var_export(defaultValue)}**`);

	return newLineToSpace(content);
}

function buildParamRow(tag, html = false) {
	let columns = [];

	columns.push(`**${getParamNamePrefixed(tag, null)}**`);
	columns.push(getWrappedVarTypes(tag).replace('|', ','));
	columns.push(getDescription(tag));

	return columns;
}

function buildParamTable(tags, html = false) {
	if (!tags.length) {
		return '';
	}

	const headers = ['Name', 'Type', 'Description'];
	let rows = [];

	if (!html) {
		const prefixRow = '> ';
		const header = `${prefixRow}\n${prefixRow}|${headers.join('|')}|\n${prefixRow}|${Array(headers.length).fill('---').join('|')}|`;
		for (const tag of Object.values(tags)) {
			rows.push(`${prefixRow}|${buildParamRow(tag, html).join('|')}|`);
		}
		return `\n${header}\n${rows.join('\n')}\n`;
	}

	const header = '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>';

	for (const tag of Object.values(tags)) {
		rows.push('<tr>' + buildParamRow(tag, html).map(column => `<td>${column}</td>`).join('') + '</tr>');

	}
	return `<table><thead>${header}</thead><tbody>${rows.join('')}</tbody></table>`;
}

module.exports = buildParamTable;
module.exports.buildParamRow = buildParamRow;