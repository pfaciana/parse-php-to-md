const {ucfirst} = require('./helpers');

function getModifierList(data, visibility = null) {
	let modifiers = [];

	for (const modifier in Object.values(['final', 'abstract', 'static'])) {
		const key = 'is' + ucfirst(modifier);
		if (key in data && data[key]) {
			modifiers.push(modifier);
		}
	}

	visibility && (modifiers.push(visibility));

	return modifiers;
}

module.exports = getModifierList;