clustr = {};

clustr.resolutions = (function() {
    var r = [];
    // meters per pixel
    var maxResolution = 156543.03390625;
    for(var zoom = 0; zoom <= 30; ++zoom) {
        r[zoom] = maxResolution / Math.pow(2, zoom);
    }
    return r;
})();

clustr.forwardMercator = function(feature) {
    var lon = feature.geometry.coordinates[0],
        lat = feature.geometry.coordinates[1];

    var x = lon * 20037508.34 / 180;
    var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return { x: x, y: y };
};

clustr.dist = function dist(a, b) {
    var c = clustr.forwardMercator(a),
        d = clustr.forwardMercator(b);

    return Math.sqrt(
        Math.pow(c.x - d.x, 2) +
        Math.pow(c.y - d.y, 2));
};

clustr.area_to_radius = function(area) {
    var radius = Math.round(Math.sqrt(area / Math.PI));
    return radius;
};
var scale_factory_cache = {};

clustr.scale_factory = function(getRadius, fillStyle, strokeStyle) {

    return function(feature) {
        if (!getRadius) throw 'getRadius must be specified';

        var radius = getRadius(feature),
            diameter = radius * 2;
        if (diameter === 0) return null;

        if (!scale_factory_cache[radius]) {
            var c = document.createElement('canvas');
            c.width = diameter;
            c.height = diameter;

            var ctx = c.getContext('2d');
            ctx.fillStyle = fillStyle || 'rgba(197, 126, 163, 0.5)';
            ctx.strokeStyle = strokeStyle || '#A63F74';
            ctx.beginPath();
            ctx.arc(radius, radius, radius * 0.95, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            scale_factory_cache[radius] = c.toDataURL();
        }

        var el = document.createElement('img');
        el.width = diameter;
        el.height = diameter;
        el.src = scale_factory_cache[radius];
        el.style.cssText =
            'width:' + diameter + 'px;' +
            'height:' + diameter + 'px;' +
            'margin-left:' + (-radius) + 'px;' +
            'margin-top:' + (-radius) + 'px;' +
            'position:absolute';

        return el;
    };

};
// Original implementation by Dave Cole @dhcole
// Formulation by Gregor Aisch
// http://vis4.net/blog/posts/clean-your-symbol-maps/
clustr.merge_intersecting = function(x, getRadius, addPoints, zoom) {
    var features = x.slice();
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
