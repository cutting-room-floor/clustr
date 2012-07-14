// This _requires_ a browser DOM to operate.

if (typeof clustr === 'undefined') clustr = {};
var scale_factory_cache = {};

clustr.scale_factory = function(getRadius, fillStyle, strokeStyle) {

    return function scale_factory(feature) {
        if (!getRadius) throw 'getRadius must be specified';
        getRadius = clustr.functor(getRadius);

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
