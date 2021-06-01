const {...fs} = require('fs');
const {normalize, sep, ...path} = require('path');
const normalizeData = require('./normalizeData');
const {writeToFile} = require('./getFiles');
const {getDataRoot} = require('./getPaths');
const {getPath} = require('./refInfo');
const views = ['name', 'description', 'synopsis', 'tableOfContents', 'globals', 'errors', 'exceptions', 'examples', 'usage', 'seeAlso', 'changelog', 'options', 'notes', 'breadcrumbs'];
const templates = {};
for (const view of Object.values(views)) {
	templates[`${view}Template`] = require(`./views/${view}Template`);
}

function buildFile(data, name, ns, type, options) {
	let sections = [];
	data = normalizeData(data, name, ns, type);
	for (const view of Object.values(views)) {
		let content = templates[`${view}Template`](data, undefined, options);
		content && sections.push(content);
	}
	const filename = normalize([options.dest, getPath(name, data.type, ns)].join(sep));
	writeToFile(filename, sections.join('\n'));
	return data;
}

function processFile(filename, options) {
	filename = normalize(filename);
	if (!fs.existsSync(filename)) {
		return false;
	}

	const {dir, name: type} = path.parse(filename);
	if (['uses'].includes(type)) {
		return false;
	}

	const ns = ((dir + sep).replace(getDataRoot(), '') || '/').slice(0, -1).split(sep).filter(x => x);
	const data = JSON.parse(fs.readFileSync(filename, options.encoding || 'utf-8'));

	for (const [name, origData] of Object.entries(data)) {
		const data = buildFile(origData, name, ns, type, options);

		if (['classes', 'traits', 'interfaces'].includes(type)) {
			for (const subType of Object.values(['constants', 'properties', 'methods'])) {
				if (subType in data && data[subType]) {
					for (let [subName, details] of Object.entries(data[subType])) {
						buildFile(details, [name, subName], ns, [type, subType], options);
					}
				}
			}
		}
	}
}

module.exports = processFile;
module.exports.writeToFile = writeToFile;