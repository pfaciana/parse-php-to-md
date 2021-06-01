const {getWrappedVarTypes} = require('./getVarTypes');
const getParamDefault = require('./getParamDefault');
const buildParamTable = require('./buildParamTable');
const {newLineToSpace, var_export} = require('./helpers');

function buildDescription(tag) {

	var lines = [];
	var html = '';

	tag.tagName ??= 'tag';

	if (!['return', 'global'].includes(tag.tagName)) {
		lines.push('**' + (tag.optional ? 'Optional' : 'Required') + '.**');
	}

	if (tag.type) {
		lines.push(getWrappedVarTypes(tag));
	}

	if (typeof tag.desc !== 'object') {
		const desc = newLineToSpace(tag.desc);
		desc && (lines.push(desc));
	} else if ('tags' in tag.desc && tag.desc.tags.length) {
		tag.desc.summary ??= '';
		tag.desc.description ??= '';
		const desc = (tag.desc.summary + ' ' + tag.desc.description).trim();
		desc && (lines.push(desc));
		html = buildParamTable(tag.desc.tags);
	}

	const [hasDefault, defaultValue] = getParamDefault(tag);

	hasDefault && (lines.push(` **Default: ${var_export(defaultValue)}**`));

	return (newLineToSpace(lines.join(' ')) + html).trim();
}

module.exports = buildDescription;