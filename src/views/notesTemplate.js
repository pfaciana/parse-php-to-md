function getNotes(data) {
	let notes = [];

	if (!('tags' in data) || data.tags.length < 1) {
		return notes;
	}

	for (const tag of Object.values(data.tags)) {
		if (['internal', 'todo'].includes(tag.tagName)) {
			notes.push({inline: '@' + tag.tagName, blocks: tag.desc,});
		}
	}

	return notes;
}

function noteTemplate(note) {
	note.inline ??= '';
	note.blocks = Array.isArray(note.blocks) ? note.blocks : [note.blocks];
	const blocks = note.blocks.length ? '> ' + note.blocks.join(`  \n> `) : '';

	return `\n> **Note:** ${note.inline}  \n${blocks}\n`;
}

function notesTemplate(data, title = 'Notes') {
	const notes = getNotes(data);

	if (!notes.length) {
		return '';
	}

	let items = [];

	for (const note of Object.values(notes)) {
		items.push(noteTemplate(note));
	}

	return `\n### ${title}\n___\n${items.join('')}\n`;
}

module.exports = notesTemplate;
module.exports.noteTemplate = noteTemplate;
module.exports.getNotes = getNotes;