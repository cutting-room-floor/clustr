if (typeof clustr === 'undefined') clustr = {};

// Animate from a to b with common group getGroup
clustr.animate_transition = function(a, b, getGroup, to) {
    var groupBy;

    if (typeof getGroup === 'string') {
        groupBy = function(f) {
            return f.properties[getGroup];
        };
    } else {
        groupBy = getGroup;
    }

    var a_groups = {},
        b_groups = {};

    for (var i = 0; i < a.length; i++) {
        var key = groupBy(a[i]);
        (a_groups[key] || (a_groups[key] = [])).push(a[i]);
    }

    for (var i = 0; i < b.length; i++) {
        var key = groupBy(b[i]);
        (b_groups[key] || (b_groups[key] = [])).push(b[i]);
    }

    // currently a is on screen. let's replace it with b.
    // if a feature is in both a and b, replace the evental b position
    // with the position in a and interpolate
    var f = [];

    for (var g in a_groups) {
        if (a_groups[g].length == 1 && g in b_groups) {
            for (var i = 0; i < b_groups[g].length; i++) {
                var ac = a_groups[g][0].geometry.coordinates;
                if (!b_groups[g][i].geometry.original_coordinates) {
                    b_groups[g][i].geometry.original_coordinates = b_groups[g][i].geometry.coordinates;
                }
                var bc = b_groups[g][i].geometry.original_coordinates;
                b_groups[g][i].geometry.coordinates = [
                    ac[0] + (bc[0] - ac[0]) * to,
                    ac[1] + (bc[1] - ac[1]) * to];
            }
        }
    }

    for (var g in b_groups) {
        for (var i = 0; i < b_groups[g].length; i++) {
            f.push(b_groups[g][i]);
        }
    }

    return f;
};

if (typeof module !== 'undefined') module = module.exports = clustr.animate_transition;
