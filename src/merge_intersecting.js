if (typeof clustr === 'undefined') clustr = {};
// Original implementation by Dave Cole @dhcole
// Formulation by Gregor Aisch
// http://vis4.net/blog/posts/clean-your-symbol-maps/
clustr.merge_intersecting = function(x, getRadius, addPoints, zoom, stop) {
    var features = x.slice();
    getRadius = clustr.functor(getRadius);
    var it = 0;
    for (var i = 0; i < features.length; i++) {
        for (var n = 0; n < features.length; n++) {
            if (i === n) continue;
            // measurements in px
            var distance_between_points = clustr.dist(features[i], features[n]) / clustr.resolutions[zoom];
            var total_radius = getRadius(features[i]) + getRadius(features[n]);

            // Handle overlapping markers
            if (distance_between_points < total_radius) {
                var to_remove = (getRadius(features[i]) > getRadius(features[n])) ? n : i;
                var to_keep = (to_remove === i) ? n : i;
                var total_combined_size = (features[i].total || 1) + (features[n].total || 1);
                features[to_keep].total = total_combined_size;
                addPoints(features[to_keep], features[to_remove]);
                features.splice(to_remove, 1);
                if (to_remove === i) {
                    n = 0;
                } else { i = 0; }
            }
            it++;
            if (it > stop) return features;
        }
    }
    return features;
};

if (typeof module !== 'undefined') module.exports = clustr.merge_intersecting;
