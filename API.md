# clustr

Cluster is a library for clustering points and makers.

## clustr.scale_factory(getRadius, fillStyle, strokeStyle)

This is how clustr can display points. It's a style factory for [markers](http://github.com/mapbox/markers.js) that uses a Canvas element to draw circles.

This returns a factory compatible with markers.js. `getRadius` should be a function that is given a GeoJSON feature object and returns a number radius for its marker. fillStyle and strokeStyle are color values passed directly to the Canvas context styling the feature.

## clustr.merge_intersecting(features, getRadius, addPoints, zoom)

Return a clustered set of features from the passed `features` argument. `getRadius` should be a function that is given a GeoJSON feature object and returns a number radius for its marker. `addPoints` is a function that takes two arguments, points `a` and `b`, and returns a point of them 'added', with aggregated properties. `zoom` is a zoom number for a zoom level in Spherical Mercator which determines how distances between points will be calculated.

## Utilities

Clustr provides several utilities that address its main trick - symbolizer-friendly clustering.

### clustr.resolutions

An array of resolutions indexed by zoom levels.
The resolutions are in meters / pixel, so the most common use is to divide the distance between points by the resolution in order to determine the number of pixels between the features.

### clustr.dist(a, b)

A simple distance between a & b, which are expected to be [GeoJSON](http://www.geojson.org/) feature objects. The distance returned is in **meters**.

### clustr.area_to_radius(value)

Calculates the radius of a circle of a certain area. Scaled points should be scaled by area, not radius, so `cluster.scale_factory` uses this. The single argument must be a number representing the area desired.

### clustr.functor(value)

This is a simple function that takes an argument that is either a function or a value. If the argument is a function, it returns the value - otherwise it returns a function returning the value.

### clustr.centroid(features)

Derive a centroid from an array of GeoJSON features.

**Arguments:**

* `features` must be non-zero array of GeoJSON features with coordinates

**Returns** a two-element array that can be used as the `geometry.coordinates` of a derived point feature.