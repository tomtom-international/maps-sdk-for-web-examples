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

// Takes number of seconds as a parameter and returns a formatted time
function formatToDurationTimeString(secondsValue) {
    if (secondsValue === 0) {
        return 'No delay';
    }
    var hours = Math.floor(secondsValue / 3600);
    var minutes = Math.floor((secondsValue - hours * 3600) / 60);
    var seconds = secondsValue - hours * 3600 - minutes * 60;

    return (hours ? hours + ' h ' : '') + (minutes ? minutes + ' min ' : '') + (seconds ? seconds + ' s' : '');
}

// Takes date (of the current day) as a parameter and returns a time (HH:MM:SS) in AM/PM or 24H format depending on the user's location
function formatToTimeString(date) {
    return Intl.DateTimeFormat('default', //eslint-disable-line
        { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date(date));
}

// Takes date (of the future day) as a parameter and returns a formatted date (DAY-OF-THE-WEEK, MMM DD, HH:MM:SS)
function formatToExpandedDateTimeString(date) {
    var today = new Date(date);
    return today.toLocaleString('default', { weekday: 'long' }) + ', ' +
        today.toLocaleString('default', { month: 'short' }) + ' ' +
        today.getDate() + ', ' +
        formatToTimeString(date);
}

function formatAsImperialDistance(distanceMeters) {
    var yards = Math.round(distanceMeters * 1.094);

    if (yards >= 1760) {
        return Math.round(yards / 10) / 100 + ' mi';
    }
    return yards + ' yd';
}

function formatAsMetricDistance(distanceMeters) {
    var distance = Math.round(distanceMeters);

    if (distance >= 1000) {
        return Math.round(distance / 10) / 100 + ' km';
    }
    return distance + ' m';
}

function roundLatLng(num) {
    return Math.round(num * 1000000) / 1000000;
}

var Formatters = {
    convertToPoint: convertToPoint,
    convertToSpeedFormat: convertToSpeedFormat,
    formatToDurationTimeString: formatToDurationTimeString,
    formatToTimeString: formatToTimeString,
    formatToExpandedDateTimeString: formatToExpandedDateTimeString,
    formatAsImperialDistance: formatAsImperialDistance,
    formatAsMetricDistance: formatAsMetricDistance,
    roundLatLng: roundLatLng
};

window.Formatters = window.Formatters || Formatters;
