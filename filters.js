var config = require('./config');


var FLAGS = {
	optional: '(optional) ',
	deprecated: '(deprecated) '
};

function parse_object(obj) {
	if (typeof(obj) != 'string') return;
	var res = {o: obj};
	if (res.o.indexOf && res.o.indexOf(FLAGS.optional) === 0) {
		res.o = res.o.slice(FLAGS.optional.length);
		res.optional = true;
	}
	
	var description_match = res.o.match(/([^\(]*) \((.*)\)/);
	
	if (description_match) {
		res.o = description_match[1];
		res.desc = description_match[2];
	}
	
	var custom = config.custom_types[res.o];
	if (custom) {
		res.id = res.o;
		res.o = custom;
	}
	if (res.optional || res.desc || res.id)
		return res;
}

function muted(txt) {
	return '<span class="text-muted">' + txt + '</span>';
}

function value_tag(value) {
	return '<span class="' + typeof(value) + '-value">' + value + '</span>';
}

function type_tag(type, id) {
	var parsed = parse_object(type);
	if (parsed) return type_tag(parsed.o, parsed.id);
	if (['int', 'float', 'string', 'bool'].indexOf(type) != -1)
		return '<span class="base-type">' + type + '</span>';
	if (typeof(type) == 'string')
		return '<span class="enumerated-type">enumerated</span> ' + muted(' (' + type.split('|').join(', ') + ')');
	if (type.inline)
		return type_tag(type.type || type.inline) + (type.name ? muted(' (' + type.name + ')') : '');
	else
		return '<a href="#custom-type-' + id + '" class="custom-type">' + type.name + '</a>';
}

function value_input(parameter, name, type) {
	type = type || parameter.type;
	var parsed = parse_object(type);
	if (parsed) return value_input(parameter, name, parsed.o);
	
	var attr = 'class="form-control input-sm" name="' + name + '"';
	if (type == 'bool')
		return '<input type="checkbox" ' + (parameter.default ? 'checked ' : '' ) + attr + '>';
	if (type.indexOf && type.indexOf('|') != -1) {
		var select = '<select ' + attr + '>';
		var vals = parameter.type.split('|');
		if (!parameter.required && !parameter.default)
			vals.unshift(parameter.default = '');
		for (var i in vals)
			select += '<option value="' + vals[i] + '" ' + (parameter.default == vals[i] ? 'selected' : '') + '>' + vals[i] + '</option>';
		return select + '</select>';
	}
	return '<input ' + attr + ' placeholder="' + (parameter.default || '') + '">';
}
module.exports = {
	description: function(str) {
		if (str.indexOf && str.indexOf(FLAGS.deprecated) === 0)
			return muted(FLAGS.deprecated) + str.slice(FLAGS.deprecated.length);
		else
			return str;
	},
	type: function(parameter) {
		return type_tag(parameter.type);
	},
	value: function(parameter, name) {
		return value_input(parameter, name);
	},
	object: function(obj, is_valued) {
		var INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;';
		function stringify(obj, indent) {
			if (!is_valued) {
				var parsed = parse_object(obj);
				if (parsed) {
					var res;
					if (!parsed.id || parsed.o.inline)
						res = stringify(parsed.id ? parsed.o.type : parsed.o, indent);
					else
						res = type_tag(parsed.o, parsed.id);
					if (parsed.o.inline && parsed.o.name) res += muted(' (' + parsed.o.name + ')');
					if (parsed.desc) res = muted(parsed.desc + ': ') + res;
					if (parsed.optional) res = muted(FLAGS.optional) + res;
					return res;
				}
			}
			
			if (obj instanceof Array) {
				if (is_valued)
					return '[' + obj.map(function(o) { return stringify(o, indent) }).join(', ') + ']';
				
				var length, res = '[' + stringify(obj[0], indent) + ', …]';
				if (obj.length > 1) length = 'len ≤ ' + obj[1] + ' ';
				if (obj.length > 2) length = obj[2] + ' ≤ ' + length;
				if (length) res += ' ' + muted(length);
				return res;
			}
			if (obj instanceof Object) {
				var objects = [];
				for (var key in obj)
					objects.push(indent + INDENT + '<span class="key">' + key + '</span>' + ': ' + stringify(obj[key], indent + INDENT));
				
				return '{<br>' + objects.join(',<br>') + '<br>' + indent + '}';
			}
			
			return is_valued ? value_tag(obj) : type_tag(obj);
		}
		return stringify(obj, '');
	}
};