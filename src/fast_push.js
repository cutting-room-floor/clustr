if (typeof clustr === 'undefined') clustr = {};
// Original implementation by Dave Cole @dhcole
// Formulation by Gregor Aisch
// http://vis4.net/blog/posts/clean-your-symbol-maps/
clustr.fast_push = function(x, getRadius, zoom) {
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
      function gr(n) { return res * getRadius(n); };
      node.radius = gr(node);
      var r = node.radius + 10,
          nx1 = node.x - r,
          nx2 = node.x + r,
          ny1 = node.y - r,
          ny2 = node.y + r;
      return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
          quad.point.radius = gr(quad.point);
          var x = node.x - quad.point.x,
              y = node.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = 30000 + (node.radius + quad.point.radius);
          if (l < r) {
              l = (l - r) / l * .5;
              if (node.radius > quad.point.radius) {
                quad.point.x += x * l;
                quad.point.y += y * l;
              } else {
                node.x -= x * l;
                node.y -= y * l;
              }
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

    for (var j = 0; j < features.length; j++) {
        var proj = clustr.forwardMercator(features[j]);
        features[j].geometry.coordinates = clustr.backwardMercator(features[j]);
    }

    return features;
};

if (typeof module !== 'undefined') module.exports = clustr.fast_merge;
