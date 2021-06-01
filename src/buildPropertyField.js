const isset = require('es5-util/js/isSetStrict');
const getVarTypes = require('./getVarTypes');
const {newLineToSpace, var_export} = require('./helpers');

function buildPropertyField(name, types = [], value = null, modifiers = [], url = false, isConstant = false) {
	name = Array.isArray(name) ? name[name.length - 1] : name;

	const modifiersStr = modifiers.join(' ') + (modifiers.length ? ' ' : '');
	const type = types.length ? getVarTypes({type: types}) + ' ' : '';
	let propertyStr = (isConstant ? '' : '$') + name;
	url && (propertyStr = `**[${propertyStr}](${url})**`);
	const valueStr = isset(value) ? ' = ' + var_export(value) : ' ';

	return newLineToSpace(`${modifiersStr}${type}${propertyStr}${valueStr};`);
}

module.exports = buildPropertyField;