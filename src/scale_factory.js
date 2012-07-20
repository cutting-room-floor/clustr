// This _requires_ a browser DOM to operate.

if (typeof clustr === 'undefined') clustr = {};
var scale_factory_cache = {};

clustr.scale_factory = function(getRadius, fillStyle, strokeStyle) {
    var fillStyle = fillStyle || 'rgba(197, 126, 163, 0.5)',
        strokeStyle = strokeStyle || 'A63F74';

    if (isCanvasSupported()) return scale_factory;
    return scale_factory_ie;

    function isCanvasSupported(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }

    function scale_factory(feature) {
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
            ctx.fillStyle = fillStyle;
            ctx.strokeStyle = strokeStyle;
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
    }

    function scale_factory_ie(feature) {
        if (!getRadius) throw 'getRadius must be specified';
        getRadius = clustr.functor(getRadius);

        var radius = getRadius(feature),
            diameter = radius * 2;
        if (diameter === 0) return null;

        // Calculate new sizes, account for 11% extra space on Google image
        var ieBgSize = Math.round(diameter + (diameter * 0.11)),
            ieMarkerSize = ((ieBgSize - 2) > 0) ? (ieBgSize - 2) : 1;

        // Normalize colors to hex
        fillStyle = normalizeColor(fillStyle);
        strokeStyle = normalizeColor(strokeStyle);

        var ieMarker = 'http://chart.apis.google.com/chart?' +
                'cht=it&' +
                'chs=' + ieMarkerSize + 'x' + ieMarkerSize + '&' +
                'chco=' + fillStyle + 'ff,00000000,00000000&' +
                'chf=bg,s,00000000&' +
                'ext=.png',
            ieBg = 'http://chart.apis.google.com/chart?' +
                'cht=it&' +
                'chs=' + ieBgSize + 'x' + ieBgSize + '&' +
                'chco=' + strokeStyle + 'ff,00000000,00000000&' +
                'chf=bg,s,00000000&' +
                'ext=.png';

        var el = document.createElement('div');
        el.width = diameter;
        el.height = diameter;
        el.style.cssText =
            'width:' + diameter + 'px;' +
            'height:' + diameter + 'px;' +
            'margin-left:' + (-radius) + 'px;' +
            'margin-top:' + (-radius) + 'px;' +
            'background: no-repeat url(' + ieBg + ');' +
            'position:absolute';

        var marker = document.createElement('div');
        marker.style.cssText =
            'width:' + diameter + 'px;' +
            'height:' + diameter + 'px;' +
            'background: no-repeat 1px 1px url(' + ieMarker + ');';

        el.appendChild(marker);
        return el;

        function normalizeColor(c) {
            if (c.charAt(0) === '#') return c.substr(1);
            var m = /rgba?\((\d+), (\d+), (\d+)/.exec(c);
            return m ? ( m[1] << 16 | m[2] << 8 | m[3] ).toString(16) : c;
        }
    }
};
