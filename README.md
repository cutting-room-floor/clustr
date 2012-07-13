# clustr

A clustering library. Right now this supports
symbol-heavy rendering like that described by [vis4](http://vis4.net/blog/posts/clean-your-symbol-maps/).

The core of clustr has no dependencies - it simply takes and
generates [GeoJSON](http://www.geojson.org/).

`clustr.scale_factory` is made to work with [markers.js](http://mapbox.com/markers.js/),
which in turn is designed to work with [Modest Maps](http://github.com/modestmaps/modestmaps-js).

# [Homepage](http://mapbox.com/clustr/)

# [Documentation](https://github.com/mapbox/clustr/blob/gh-pages/API.md)

* Implementation of `merge_intersecting` is adapted from [Dave Cole's prototype](https://github.com/dhcole), algorithm
  loosely based around [Gregor Aisch's suggestion](http://vis4.net/blog/posts/clean-your-symbol-maps/).
