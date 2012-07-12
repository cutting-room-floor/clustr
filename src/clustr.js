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
