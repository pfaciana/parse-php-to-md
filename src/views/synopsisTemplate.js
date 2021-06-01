const buildSynopsis = require('./../buildSynopsis');

function getSynopsis(data) {
	if (!['classes', 'traits', 'interfaces'].includes(data.type)) {
		return '';
	}

	return buildSynopsis(data);
}

function synopsisTemplate(data, title = 'Synopsis') {
	const synopsis = getSynopsis(data);

	return synopsis ? `\n## ${title}\n___\n${synopsis}\n` : '';
}

module.exports = synopsisTemplate;
module.exports.getSynopsis = getSynopsis;