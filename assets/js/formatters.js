function convertToPoint(position) {
    return {
        point: {
            latitude: position.lat,
            longitude: position.lng
        }
    };
}

function convertToSpeedFormat(speedValue, unit) {
    var speedUnit = unit || 'km/h';

    return speedValue + speedUnit;
}

function convertToTimeFormat(secondsValue) {
    if (secondsValue === 0) {
        return 'No delay';
    }
    var hours = Math.floor(secondsValue / 3600),
        minutes = Math.floor((secondsValue - hours * 3600) / 60),
        seconds = secondsValue - hours * 3600 - minutes * 60;

    return (hours ? hours + 'h ' : '') + (minutes ? minutes + 'min ' : '') + (seconds ? seconds + 's' : '');
}

function formatAsMetricDistance(distanceMeters) {
    var distance = Math.round(distanceMeters);

    if (distance >= 1000) {
        return Math.round(distance / 10) / 100 + 'km';
    }
    return distance + 'm';
}

function roundLatLng(num) {
    return Math.round(num * 1000000) / 1000000;
}

var Formatters = {
    convertToPoint: convertToPoint,
    convertToSpeedFormat: convertToSpeedFormat,
    convertToTimeFormat: convertToTimeFormat,
    formatAsMetricDistance: formatAsMetricDistance,
    roundLatLng: roundLatLng
};

window.Formatters = window.Formatters || Formatters;
