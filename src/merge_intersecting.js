if (typeof clustr === 'undefined') module = module.exports = clustr = {};
// Original implementation by Dave Cole @dhcole
// Formulation by Gregor Aisch
// http://vis4.net/blog/posts/clean-your-symbol-maps/
clustr.merge_intersecting = function(x, getRadius, addPoints, zoom) {
    var features = x.slice();
    getRadius = clustr.functor(getRadius);
    for (var i = 0; i < features.length; i++) {
        for (var n = 0; n < features.length; n++) {
            if (i === n) continue;
            // measurements in px
            var distance_between_points = clustr.dist(features[i], features[n]) / clustr.resolutions[zoom];
            var total_radius = getRadius(features[i]) + getRadius(features[n]);

            // Handle overlapping markers
            if (distance_between_points < total_radius) {
                var total_combined_size = (features[i].total || 1) + (features[n].total || 1);
                features[i].total = total_combined_size;
                addPoints(features[i], features[n]);
                features.splice(n, 1);
                i = 0;
            }
        }
    }
    return features;
};
