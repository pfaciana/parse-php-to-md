function getParamNamePrefixed(param, addlPrefix = '$') {
	return ((param.variadic ?? false) ? '...' : '') + ((param.byref ?? false) ? '&' : '') + (addlPrefix ? addlPrefix : '') + param.name;
}

module.exports = getParamNamePrefixed;