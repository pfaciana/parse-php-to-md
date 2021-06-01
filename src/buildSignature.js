const getVarTypes = require('./getVarTypes');
const getParamNamePrefixed = require('./getParamNamePrefixed');
const {newLineToSpace, var_export} = require('./helpers');

function buildSignature(name, params = [], returns = null, modifiers = [], url = null) {
	name = Array.isArray(name) ? name[name.length - 1] : name;

	let optional = false;
	const modifiersStr = modifiers.join(' ') + (modifiers.length ? ' ' : '');
	let propertyStr = name;
	url && (propertyStr = `**[${propertyStr}](${url})**`);
	const paramStr = params.map(param => {
		let type = getVarTypes(param);
		type && (type += ' ');
		const parameter = getParamNamePrefixed(param);
		const initializer = 'value' in param || optional ? ' = ' + var_export(param['value'] ?? null) : '';
		initializer && (optional = true);
		return `${type}${parameter}${initializer}`;
	}).join(', ');
	const returnTypes = returns ? ' : ' + getVarTypes(returns) : '';

	return newLineToSpace(`${modifiersStr}${propertyStr} ( ${paramStr} )${returnTypes}`);
}

module.exports = buildSignature;