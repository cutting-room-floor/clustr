if (typeof clustr === 'undefined') clustr = {};
// Original implementation by Dave Cole @dhcole
// Formulation by Gregor Aisch
// http://vis4.net/blog/posts/clean-your-symbol-maps/
clustr.push_intersecting = function(x, getRadius, zoom) {
    var features = x.slice(),
        res = clustr.resolutions[zoom];
    getRadius = clustr.functor(getRadius);

    // pre-cache radii, they won't change here.
    for (var i = 0; i < features.length; i++) {
        features[i]._radius = getRadius(features[i]);
    }

    features.sort(function(a, b) {
        return a._radius > b._radius;
    });


    for (var it = 0; it < 2; it++) {
        for (var i = 0; i < features.length; i++) {
            for (var n = 0; n < features.length; n++) {
                if (i == n) continue;
                // measurements in px
                var distance_between_points = clustr.dist(features[i], features[n]) /
                    // to px
                    res;
                // in px
                var total_radius = features[i]._radius + features[n]._radius;

                // Handle overlapping markers
                if (distance_between_points < total_radius) {
                    var angle_between_points = Math.atan2(
                        features[i].geometry.coordinates[1] - features[n].geometry.coordinates[1],
                        features[i].geometry.coordinates[0] - features[n].geometry.coordinates[0]);
                    // px to meters
                    var distance_desired = total_radius * res;
                    // to lon
                    distance_desired /= (20037508.34 / 180);
                    // console.log(distance_desired);
                    // return;
                    features[i].geometry.coordinates = [
                        features[n].geometry.coordinates[0] + (distance_desired * Math.cos(angle_between_points)),
                        features[n].geometry.coordinates[1] + (distance_desired * Math.sin(angle_between_points))
                    ];
                }
            }
        }
    }

    return features;
};
if (typeof module !== 'undefined') module = module.exports = clustr;
