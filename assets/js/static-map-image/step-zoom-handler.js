//FIXME: replace with lodash when LNS-38231 is done
function debounce(callback, delayInMillis) {
    var timeoutHandler;
    return function () {
        if (timeoutHandler) {
            clearTimeout(timeoutHandler);
        }

        var args = Array.prototype.slice.call(arguments);
        timeoutHandler = setTimeout(function () {
            callback.apply(null, args);
            timeoutHandler = null;
        }, delayInMillis);
    }
}

var stepZoomHandler = (function() {
    var onWheel = debounce(function(event) {
        var deltaY = event.originalEvent.deltaY;
        var detail = event.originalEvent.detail;
        var wheelDelta = event.originalEvent.wheelDelta;

        var delta = wheelDelta || -deltaY || -detail;
        var zoom = Math.round(map.getZoom()) + (delta > 0 ? 1 : -1);

        map.setZoom(zoom);
    }, 50);

    var onIdle = function() {
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
            map.on('idle', onIdle);
            map.on('wheel', onWheel);
            map.getCanvasContainer().addEventListener('wheel', onWheelHandler);
            map.scrollZoom.disable();
        },
        disable: function(map) {
            map.off('idle', onIdle);
            map.off('wheel', onWheel);
            map.getCanvasContainer().removeEventListener('wheel', onWheelHandler);
            map.scrollZoom.enable();
        }
    };
})();

window.stepZoomHandler = window.stepZoomHandler || stepZoomHandler;
