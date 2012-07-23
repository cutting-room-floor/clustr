if (typeof clustr === 'undefined') clustr = {};
if (typeof module !== 'undefined') module = module.exports = clustr;

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

clustr.backwardMercator = function(feature) {
    var R2D = 180 / Math.PI,
        A = 6378137;

    return [
        (feature.x * R2D / A),
        ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-feature.y / A))) * R2D
    ];
};

clustr.dist = function dist(a, b) {
    var c = a.fm || (a.fm = clustr.forwardMercator(a)),
        d = b.fm || (b.fm = clustr.forwardMercator(b));

    return Math.sqrt(
        Math.pow(c.x - d.x, 2) +
        Math.pow(c.y - d.y, 2));
};

clustr.area_to_radius = function(area) {
    var radius = Math.round(Math.sqrt(area / Math.PI));
    return radius;
};

clustr.functor = function(x) {
    if (typeof x === 'function') return x;
    return function() {
        return x;
    };
};

clustr.centroid = function(features) {
    var sX = 0, sY = 0, sum = 0;
    for (var i = 0; i < features.length; i++) {
        sX += features[i].geometry.coordinates[0];
        sY += features[i].geometry.coordinates[1];
    }
    return [
        sX / features.length,
        sY / features.length];
};
