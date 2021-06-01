function buildProperty(data) {
	let types = [];

	const possibleTagNames = ['const', 'opt_param', 'param', 'property', 'property-read', 'property-write', 'staticvar', 'var',];

	if (data.tags) {
		for (const tag of Object.values(data.tags)) {
			if (possibleTagNames.includes(tag.tagName)) {
				tag.type = tag.type.map(type => type.replace(/[^A-Za-z0-9-_[]]/, ''));
				types = tag.type;
				break;
			}
		}
	}

	let value = 'value' in data ? data.value : null;

	return [types, value];
}

module.exports = buildProperty;