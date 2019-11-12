function formatAsMetricDistance(distanceMeters) {
    var distance = Math.round(distanceMeters);
    if (distance >= 1000) {
        return Math.round(distance / 100) / 10 + ' km';
    }
    return distance + ' m';
}

function roundLatLng(num) {
    return Math.round(num*10000000)/10000000;
}

var Formatters = {
    formatAsMetricDistance: formatAsMetricDistance,
    roundLatLng: roundLatLng
};


window.Formatters = window.Formatters || Formatters;
