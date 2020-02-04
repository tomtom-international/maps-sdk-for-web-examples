//FIXME: replace with lodash when LNS-38231 is done
function debounce(callback, delayInMillis) {
    var timeoutHandler;
    return function() {
        if (timeoutHandler) {
            clearTimeout(timeoutHandler);
        }

        var args = Array.prototype.slice.call(arguments);
        timeoutHandler = setTimeout(function() {
            callback.apply(null, args);
            timeoutHandler = null;
        }, delayInMillis);
    };
}

var stepZoomHandler = (function() {
    var onWheel = debounce(function(map, event) {
        var deltaY = event.originalEvent.deltaY;
        var detail = event.originalEvent.detail;
        var wheelDelta = event.originalEvent.wheelDelta;

        var delta = wheelDelta || -deltaY || -detail;
        var zoom = Math.round(map.getZoom()) + (delta > 0 ? 1 : -1);

        map.setZoom(zoom);
    }, 50);

    var onIdle = function(map) {
        var zoom = Math.round(map.getZoom());
        if (zoom !== map.getZoom()) {
            map.zoomTo(zoom);
        }
    };

    function onWheelHandler(e) {
        e.preventDefault();
    }

    return {
        enable: function(map) {
            map.setZoom(Math.round(map.getZoom()));
            map.on('idle', onIdle.bind(null, map));
            map.on('wheel', onWheel.bind(null, map));
            map.getCanvasContainer().addEventListener('wheel', onWheelHandler);
            map.scrollZoom.disable();
        },
        disable: function(map) {
            map.off('idle', onIdle.bind(null, map));
            map.off('wheel', onWheel.bind(null, map));
            map.getCanvasContainer().removeEventListener('wheel', onWheelHandler);
            map.scrollZoom.enable();
        }
    };
})();

window.stepZoomHandler = window.stepZoomHandler || stepZoomHandler;
