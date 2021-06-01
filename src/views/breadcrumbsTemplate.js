const {getName, getUrl} = require('./../refInfo');

function breadcrumbsTemplate(data, title, options) {
	if (!Array.isArray(data.name) || data.name.length < 2) {
		return options.buildTOC ? `\n\n___\n\n[Go back to ${options.buildTOC === 'Home' ? 'Table of Contents' : options.buildTOC}](${options.buildTOC.replaceAll(' ', '-')})` : '';
	}

	const name = getName(data.name[0], data.parentType, data.ns);
	const url = getUrl(data.name[0], data.parentType, data.ns, false)
	return `\n\n___\n\n[Go back to ${name}](${url})`;
}

module.exports = breadcrumbsTemplate;