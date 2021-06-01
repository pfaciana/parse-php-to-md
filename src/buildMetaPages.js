const {promises: {readdir}, existsSync, ...fs} = require('fs');
const {resolve, extname, ...path} = require('path');
const {getDocsRoot} = require('./getPaths');
const {writeToFile} = require('./getFiles');
const {getUrl} = require('./refInfo');
const {ksort, uksort, ucfirst} = require('./helpers');

const typesOrder = ['classes', 'traits', 'interfaces', 'functions']

function orderTypes(a, b) {
	if (a === b) {
		return 0;
	}
	a = typesOrder.indexOf(a);
	b = typesOrder.indexOf(b);
	return a === b ? 0 : (a > b ? 1 : -1);
}

function buildTOC(options) {
	const filename = getDocsRoot('toc.json');
	if (!existsSync(filename) || !options.buildTOC) {
		return false;
	}

	let content = ['## Table of Contents'];

	const toc = JSON.parse(fs.readFileSync(filename, options.encoding || 'utf-8'));
	for (let [ns, types] of Object.entries(toc)) {
		content.push(`\n### ${ns}`);
		ns = ns === 'global' ? ns = [] : ns.split('\\');
		for (const [type, items] of Object.entries(uksort(types, orderTypes))) {
			content.push(`\n* ${ucfirst(type)}`);
			for (const [name, summary] of Object.entries(ksort(items))) {
				const url = getUrl(name, type, ns, false)
				content.push(`  * [${name}](${url})${summary.trim() ? ' - ' + summary.trim() : ''}`);
			}
		}
	}

	writeToFile(options.dest + options.buildTOC.replaceAll(' ', '-') + '.md', content.join('\n'));
}

function buildSidebar(options) {
	const filename = getDocsRoot('toc.json');
	if (!existsSync(filename) || !options.buildSidebar) {
		return false;
	}

	let content = [];

	if (options.buildTOC) {
		content.push(`# [${options.buildTOC === 'Home' ? 'Table of Contents' : options.buildTOC}](${options.buildTOC.replaceAll(' ', '-')})\n`);
	}

	const toc = JSON.parse(fs.readFileSync(filename, options.encoding || 'utf-8'));
	for (let [ns, types] of Object.entries(toc)) {
		const currentTypes = Object.keys(types);
		if (currentTypes.includes('classes') || currentTypes.includes('traits')) {
			content.push(`\n## ${ns}`);
			ns = ns === 'global' ? ns = [] : ns.split('\\');
			for (const [type, items] of Object.entries(uksort(types, orderTypes))) {
				if (['classes', 'traits'].includes(type)) {
					for (const [name, summary] of Object.entries(ksort(items))) {
						const url = getUrl(name, type, ns, false)
						content.push(`* [${name}](${url})${summary.trim() ? ' - ' + summary.trim() : ''}`);
					}
				}
			}
		}
	}

	writeToFile(options.dest + '_Sidebar.md', content.join('\n') + '\n  \n  \n___');
}

function buildFooter(options) {
	writeToFile(options.dest + '_Footer.md', 'Documentation tool brought to you by Phil Faciana &copy; [Render Dev](https://renderdev.com)');
}

module.exports.buildTOC = buildTOC;
module.exports.buildSidebar = buildSidebar;
module.exports.buildFooter = buildFooter;