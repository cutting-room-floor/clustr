if (typeof clustr === 'undefined') clustr = {};
// Original implementation by Dave Cole @dhcole
// Formulation by Gregor Aisch
// http://vis4.net/blog/posts/clean-your-symbol-maps/
clustr.fast_merge = function(x, getRadius, addPoints, zoom) {
    var features = x.slice();
    var res = clustr.resolutions[zoom];
    getRadius = clustr.functor(getRadius);

    for (var j = 0; j < features.length; j++) {
        var proj = clustr.forwardMercator(features[j]);
        features[j].x = proj.x;
        features[j].y = proj.y;
    }

    var q = quadtree(features);

    function collide(node) {
      var r = (getRadius(node) * res) + 10,
          nx1 = node.x - r,
          nx2 = node.x + r,
          ny1 = node.y - r,
          ny2 = node.y + r;
      return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
          var x = node.x - quad.point.x,
              y = node.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = 10 + ((getRadius(node) + getRadius(quad.point)) * res);
          if (l < r) {
            l = (l - r) / l * .5;
            node.x -= x *= l;
            node.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2
            || x2 < nx1
            || y1 > ny2
            || y2 < ny1;
      };
    }

    var n = features.length, i = 0;
    while (++i < n) {
        q.visit(collide(features[i]));
    }

    var n = features.length, i = 0;
    while (++i < n) {
        q.visit(collide(features[i]));
    }

    var n = features.length, i = 0;
    while (++i < n) {
        q.visit(collide(features[i]));
    }

    for (var j = 0; j < features.length; j++) {
        var proj = clustr.forwardMercator(features[j]);
        features[j].geometry.coordinates = clustr.backwardMercator(features[j]);
    }

    return features;
};

if (typeof module !== 'undefined') module.exports = clustr.fast_merge;
