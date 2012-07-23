if (typeof clustr === 'undefined') clustr = {};

clustr.simple_facet = function(x, getGroup, combine) {
    var features = x.slice(),
        groups = {},
        groupBy;

    if (typeof getGroup === 'string') {
        groupBy = function(f) {
            return f.properties[getGroup];
        };
    } else {
        groupBy = getGroup;
    }

    for (var i = 0; i < features.length; i++) {
        var key = groupBy(features[i]);
        (groups[key] || (groups[key] = [])).push(features[i]);
    }

    var f = [];

    for (var g in groups) {
        f.push(combine(groups[g]));
    }

    return f;
};

if (typeof module !== 'undefined') module = module.exports = clustr.simple_facet;
