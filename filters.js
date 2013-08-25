var config = require('./config');

function muted(txt) {
	return '<span class="text-muted">' + txt + '</span>';
}

function type_tag(type) {
	if (['int', 'float', 'string', 'bool'].indexOf(type) != -1)
		return '<span class="base-type">' + type + '</span>';

	if (type.indexOf('|') > 0)
		return '<span class="enumerated-type">enumerated</span>';

	if (type in config.custom_types) {
		var custom = config.custom_types[type];
		if (custom.inline)
			return type_tag(custom.type) + muted('(' + custom.name + ')');
		else
			return '<a href="#custom-type-' + type + '" class="custom-type">' + custom.name + '</a>';
	}
	return '<span class="unknown-type">' + type + '</span>';
}

module.exports = {
	type: function(parameter) {
		return type_tag(parameter.type);
	},
	value: function(parameter) {
		var attr = ' class="form-control input-sm" name="' + parameter.name + '"';
		if (parameter.type == 'bool')
			return '<input type="checkbox" ' + (parameter.default ? 'checked ' : '' ) + attr + '>';
		if (parameter.type.indexOf('|') > 0) {
			var select = '<select ' + attr + '>';
			if (!parameter.required)
				select += '<option value=""></option>';
			var vals = parameter.split('|');
			for (var i in vals)
				select += '<option value="' + vals[i] + '">' + vals[i] + '</option>';
			return select + '</select>';
		}
		return '<input ' + attr + ' placeholder="' + (parameter.default || '') + '">';
	},
	object: function(obj) {
		var INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;';
		var OPTIONAL_KEY = '(optional) ';
		function stringify(obj, indent) {
			if (obj instanceof Array) {
				var res = "[";
				res += indent + stringify(obj[0], indent) + ", ";
				var length = '…';
				if (obj.length > 1) {
					length = 'len ≤ ' + obj[1];
				}
				if (obj.length > 2) {
					length = obj[2] + ' ≤ ' + length;
				}
				return res + muted(length) + ' ]';
			}
			if (obj instanceof Object) {
				var res = indent + "{<br>";
				for (var key in obj) {
					res += indent + INDENT + key + ': ' + stringify(obj[key], indent + INDENT) + ",<br>";
				}
				return res.slice(0, -5) + "<br>" + indent + "}";
			}
			if (obj.indexOf && obj.indexOf(OPTIONAL_KEY) === 0) {
				return muted(OPTIONAL_KEY) + stringify(obj.slice(OPTIONAL_KEY.length));
			}
			var custom_type = config.custom_types[obj];
			if (custom_type && custom_type.inline)
				return stringify(custom_type.type, indent) + muted(' (' + custom_type.name + ')');
			return type_tag(obj);
		}
		return stringify(obj, '');
	}
};