function getWrappedVarTypes(param) {
	const types = getVarTypes(param);
	return types ? '*(' + types + ')*' : '';
}

function getVarTypes(param) {
	return 'type' in param ? (Array.isArray(param.type) ? (param.type.length ? param.type.join('|') : '') : param.type) : '';
}

module.exports = getVarTypes;
module.exports.getWrappedVarTypes = getWrappedVarTypes;