const {getName} = require('./../refInfo');

function nameTemplate(data) {
	const name = getName(data.name, data.type, data.ns);
	return `\n# ${name}\n___\n${data.summary}\n`;
}

module.exports = nameTemplate;