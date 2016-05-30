function underscoreTemplate(text) {
    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
    var escapeChar = function(match) {
        var escapes = {
            "'":      "'",
            '\\':     '\\',
            '\r':     'r',
            '\n':     'n',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };

        return '\\' + escapes[match];
    };
    var matcher = RegExp([
            (/<%=([\s\S]+?)%>/g).source,
            (/<%([\s\S]+?)%>/g).source
        ].join('|') + '|$', 'g');
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escaper, escapeChar);
        index = offset + match.length;

        if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
        }

        return match;
    });
    source += "';\n";
    source = 'with(obj||{}){\n' + source + '}\n';
    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + 'return __p;\n';

    try {
        var render = new Function('obj', source);
    } catch (e) {
        e.source = source;
        throw e;
    }

    var template = function(data) {
        return render.call(this, data);
    };

    template.source = 'function(obj){\n' + source + '}';

    return template;
}