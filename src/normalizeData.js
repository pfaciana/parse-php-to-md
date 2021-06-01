const {ksort} = require('./helpers');
const getModifierList = require('./getModifierList');

function normalizeData(origData, name, ns, type) {
	const parentType = Array.isArray(type) && type.length > 1 ? type[0] : null;
	type = Array.isArray(type) ? type[type.length - 1] : type;
	let data = {name, ns, type, parentType};

	for (const key of Object.values(['constants', 'properties', 'methods'])) {
		if (key in origData && origData[key]) {
			data[key] ??= {}
			for (const [visibility, item] of Object.entries(origData[key])) {
				if (visibility === 'public') {
					for (const [name, details] of Object.entries(item)) {
						details.name = name;
						details.visibility = visibility;
						details.modifiers = getModifierList(details, visibility);
						details.comment = 'comments' in details && details.comments.length > 0 ? details.comments[details.comments.length - 1] : {};
						details.tags = details.comment.tags ?? [];
						details.summary = details.comment.summary ?? '';
						details.description = details.comment.description ?? '';
						data[key][name] = details;
					}
				}
			}
			key in data && (data[key] = ksort(data[key]));
		}
	}

	data.comment = 'comments' in origData && origData.comments.length > 0 ? origData.comments[origData.comments.length - 1] : {};
	data.tags = data.comment.tags ?? [];
	data.summary = data.comment.summary ?? '';
	data.description = data.comment.description ?? '';

	return {...origData, ...data};
}

module.exports = normalizeData;