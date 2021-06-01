const {newLineToSpace} = require('./helpers');

function getParamDefault(param) {
	for (let key of Object.values(['defaultObj', 'defaultValue', 'value'])) {
		if (key in param && (param.optional || key !== 'value')) {
			if (param[key] === 'empty') {
				if (param.value) {
					key = 'value';
				} else if (param.type.includes('array')) {
					param[key] = [];
				} else if (param.type.includes('string')) {
					param[key] = '';
				} else if (param.type.includes('object')) {
					param[key] = {};
				}
			}

			return [true, newLineToSpace(param[key])];
		}
	}

	if ('optional' in param && param.optional) {
		if (param.type.includes('array')) {
			return [true, []];
		}
		if (param.type.includes('string')) {
			return [true, ''];
		}
		if (param.type.includes('object')) {
			return [true, {}];
		}
	}

	return [false, null];


}

module.exports = getParamDefault;