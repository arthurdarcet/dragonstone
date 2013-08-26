var config = require('./config');

function muted(txt) {
	return '<span class="text-muted">' + txt + '</span>';
}

function value_tag(value) {
	return '<span class="' + typeof(value) + '-value">' + value + '</span>';
}

function type_tag(type) {
	if (['int', 'float', 'string', 'bool'].indexOf(type) != -1)
		return '<span class="base-type">' + type + '</span>';
	if (type in config.custom_types) {
		var custom = config.custom_types[type];
		if (custom.inline)
			return type_tag(custom.type) + (custom.name ? muted('(' + custom.name + ')') : '');
		else
			return '<a href="#custom-type-' + type + '" class="custom-type">' + custom.name + '</a>';
	}
	if (type.indexOf('|') != -1)
		return '<span class="enumerated-type">enumerated</span> ' + muted('(' + type.split('|').join(', ') + ')');
	return '<span class="unknown-type">' + type + '</span>';
}

function value_input(parameter, name) {
	if (parameter.type in config.custom_types) {
		parameter.type = config.custom_types[parameter.type].type;
		return value_input(parameter, name);
	}
	var attr = 'class="form-control input-sm" name="' + name + '"';
	if (parameter.type == 'bool')
		return '<input type="checkbox" ' + (parameter.default ? 'checked ' : '' ) + attr + '>';
	if (parameter.type.indexOf('|') != -1) {
		var select = '<select ' + attr + '>';
		var vals = parameter.type.split('|');
		if (!parameter.required && !parameter.default) {
			parameter.default = '';
			vals.unshift('');
		}
		for (var i in vals)
			select += '<option value="' + vals[i] + '" ' + (parameter.default == vals[i] ? 'selected' : '') + '>' + vals[i] + '</option>';
		return select + '</select>';
	}
	return '<input ' + attr + ' placeholder="' + (parameter.default || '') + '">';
}

module.exports = {
	type: function(parameter) {
		return type_tag(parameter.type);
	},
	value: function(parameter, name) {
		return value_input(parameter, name);
	},
	object: function(obj, is_valued) {
		var INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;';
		var OPTIONAL_KEY = '(optional) ';
		function stringify(obj, indent) {
			if (!obj) return '';
			if (obj instanceof Array) {
				if (is_valued) {
					return '[' + obj.map(function(o) { return stringify(o, indent) }).join(', ') + ']';
				}
				else {
					var res = '[' + stringify(obj[0], indent) + ', …]';
					var length;
					if (obj.length > 1) {
						length = 'len ≤ ' + obj[1] + ' ';
					}
					if (obj.length > 2) {
						length = obj[2] + ' ≤ ' + length;
					}
					if (length)
						res += ' ' + muted(length);
					return res;
				}
			}
			if (obj instanceof Object) {
				var objects = [];
				for (var key in obj) {
					objects.push(indent + INDENT + '<span class="key">' + key + '</span>' + ': ' + stringify(obj[key], indent + INDENT));
				}
				return '{<br>' + objects.join(',<br>') + '<br>' + indent + '}';
			}
			if (obj.indexOf && obj.indexOf(OPTIONAL_KEY) === 0) {
				return muted(OPTIONAL_KEY) + stringify(obj.slice(OPTIONAL_KEY.length));
			}
			var custom_type = config.custom_types[obj];
			if (custom_type && custom_type.inline)
				return stringify(custom_type.type, indent) + (custom_type.name ? muted(' (' + custom_type.name + ')') : '');
			return is_valued ? value_tag(obj) : type_tag(obj);
		}
		return stringify(obj, '');
	}
};