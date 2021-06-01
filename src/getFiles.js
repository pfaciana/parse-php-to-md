const {promises: {readdir}, existsSync, ...fs} = require('fs');
const {resolve, ...path} = require('path');

function writeToFile(filename, content) {
	fs.mkdirSync(path.dirname(filename), {recursive: true})
	fs.writeFileSync(filename, content);
}

async function* getFiles(dir) {
	const dirEntries = await readdir(dir, {withFileTypes: true});
	for (const dirEntry of dirEntries) {
		const path = resolve(dir, dirEntry.name);
		if (dirEntry.isDirectory()) {
			yield* getFiles(path);
		} else {
			yield path;
		}
	}
}

module.exports = getFiles;
module.exports.writeToFile = writeToFile;