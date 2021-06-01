function array_unique(arr) {
	if ([undefined, null, ''].indexOf(arr) > -1) {
		return [];
	}
	if (!Array.isArray(arr)) {
		return [arr];
	}
	return arr.filter((value, index, self) => self.indexOf(value) === index);
}

function ksort(origObj) {
	return Object.keys(origObj).sort().reduce(
		(obj, key) => {
			obj[key] = origObj[key];
			return obj;
		},
		{}
	);
}

function uksort(origObj, callback) {
	return Object.keys(origObj).sort(callback).reduce(
		(obj, key) => {
			obj[key] = origObj[key];
			return obj;
		},
		{}
	);
}

function ucfirst(string) {
	if (typeof string !== 'string') return ''
	return string.charAt(0).toUpperCase() + string.slice(1)
}


function version_compare(b, a) {
	if (a === b) {
		return 0;
	}
	let splitA = a.split('.');
	let splitB = b.split('.');
	const length = Math.max(splitA.length, splitB.length);
	for (let i = 0; i < length; i++) {
		//FLIP
		if (parseInt(splitA[i]) > parseInt(splitB[i]) ||
			((splitA[i] === splitB[i]) && isNaN(splitB[i + 1]))) {
			return 1;
		}
		//DONT FLIP
		if (parseInt(splitA[i]) < parseInt(splitB[i]) ||
			((splitA[i] === splitB[i]) && isNaN(splitA[i + 1]))) {
			return -1;
		}
	}
}

function newLineToSpace(str) {
	return typeof str === 'string' ? str.replaceAll("\n", ' ').replaceAll("\\n", ' ').trim() : str;
}

function addcslashes(string, chars = ['\\', '\u0008', '\t', '\n', '\f', '\r', "'", '"']) {
	for (const char of Object.values(chars)) {
		string = string.replaceAll(char, '\\' + char);
	}
	return string;
}

function var_export(x, indent = '') {
	if (x === null) {
		return 'NULL';
	}
	if (typeof x === 'string') {
		return `'${addcslashes(x, ["\'", "\r", "\n", "\t", "\v", "\f"])}'`.replaceAll("\\'", '"');
	}
	if (typeof x === 'object') {
		let r = [];
		for (const [key, value] of Object.entries(x)) {
			r.push(`${indent}${indent}` + (Array.isArray(x) ? '' : var_export(key) + ' => ') + var_export(value, `${indent}${indent}`));
		}
		return "[" + r.join(", ") + (r.length ? ',' : '') + indent + "]";
	}
	if (typeof x === "boolean") {
		return x ? "TRUE" : "FALSE";
	}

	return JSON.stringify(x, null, 4);
}

module.exports.ksort = ksort;
module.exports.uksort = uksort;
module.exports.ucfirst = ucfirst;
module.exports.version_compare = version_compare;
module.exports.newLineToSpace = newLineToSpace;
module.exports.array_unique = array_unique;
module.exports.addcslashes = addcslashes;
module.exports.var_export = var_export;