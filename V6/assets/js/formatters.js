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

    function getNumberOfDays(secondsValue) {
        var days = Math.floor(secondsValue / (3600 * 24));
        var rest = secondsValue % (3600 * 24);

        return {
            days: days,
            rest: rest
        };
    }

    function getProperDaysLabel(days) {
        return days === 1 ? ' day ' : ' days ';
    }

    var miliseconds = moment.utc(secondsValue * 1000);

    if (secondsValue > 3600 * 24) {
        var numberOfDays = getNumberOfDays(secondsValue);

        var daysString = numberOfDays.days + getProperDaysLabel(numberOfDays.days);
        var hoursAndMinutes = moment.utc(numberOfDays.rest * 1000);
        var hoursAndMinutesString = hoursAndMinutes.format('h [h] m [m]');

        return daysString + hoursAndMinutesString;
    } else if (secondsValue > 3600) {
        return miliseconds.format('H [h] m [m] s [s]');
    } else if (secondsValue > 60) {
        return miliseconds.format('m [m] s [s]');
    } else if (secondsValue > 0) {
        return miliseconds.format('s [s]');
    }

    return 'No delay';
}

function formatToShortDurationTimeString(secondsValue) {
    var duration = moment.duration(secondsValue, 'seconds');

    if (secondsValue > 3600) {
        return duration.format('h [h] m [m]');
    } else if (secondsValue > 60) {
        return duration.format('m [m]');
    }

    return 'No delay';
}

// Takes date (of the current day) as a parameter and returns a time (HH:MM:SS) in AM/PM or 24H format depending on the user's location
function formatToTimeString(date) {
    return moment(date).format('HH:mm:ss');
}

function formatToDateString(date) {
    return moment(date).format('DD/MM/YYYY');
}

function formatToShortenedTimeString(date) {
    return moment(date).format('h:mm a');
}

function dateTimeStringToObject(dateString, timeString) {
    if (!dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)) {
        throw new TypeError('Wrong date format provided. It needs to follow dd/mm/yyyy pattern.');
    }

    return moment(dateString + timeString, 'DD/MM/YYYYh:mm A').toDate();
}

function dateStringToObject(dateString) {
    return moment(dateString, 'YYYY-MM-DD').toDate();
}

function formatToDateWithFullMonth(date) {
    return moment(date).format('MMMM D, YYYY');
}

// Takes date (of the future day) as a parameter and returns a formatted date (DAY-OF-THE-WEEK, MMM DD, HH:MM:SS)
function formatToExpandedDateTimeString(date) {
    return moment(date).format('dddd, MMM D, HH:mm:ss');
}

function formatToDateTimeString(date) {
    return moment(date).format('MMM D, HH:mm:ss');
}

function formatToDateTimeStringForTrafficIncidents(date) {
    return moment(date).format('YYYY-MM-DD HH:mm');
}

function formatAsImperialDistance(distanceMeters) {
    var yards = Math.round(distanceMeters * 1.094);

    if (yards >= 1760) {
        return Math.round(yards / 17.6) / 100 + ' mi';
    }
    return yards + ' yd';
}

function formatAsMetricDistance(distanceMeters) {
    var distance = Math.round(distanceMeters);

    if (distance >= 1000) {
        return Math.round(distance / 100) / 10 + ' km';
    }
    return distance + ' m';
}

function roundLatLng(num) {
    return Math.round(num * 1000000) / 1000000;
}

function formatCategoryName(name) {
    var formattedName = name.toLowerCase().replace(/_/g, ' ');
    return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
}

var Formatters = {
    convertToPoint: convertToPoint,
    convertToSpeedFormat: convertToSpeedFormat,
    formatToDurationTimeString: formatToDurationTimeString,
    formatToShortDurationTimeString: formatToShortDurationTimeString,
    formatToTimeString: formatToTimeString,
    formatToExpandedDateTimeString: formatToExpandedDateTimeString,
    formatAsImperialDistance: formatAsImperialDistance,
    formatAsMetricDistance: formatAsMetricDistance,
    roundLatLng: roundLatLng,
    formatToDateString: formatToDateString,
    formatToShortenedTimeString: formatToShortenedTimeString,
    dateTimeStringToObject: dateTimeStringToObject,
    dateStringToObject: dateStringToObject,
    formatToDateWithFullMonth: formatToDateWithFullMonth,
    formatCategoryName: formatCategoryName,
    formatToDateTimeString: formatToDateTimeString,
    formatToDateTimeStringForTrafficIncidents: formatToDateTimeStringForTrafficIncidents
};

window.Formatters = window.Formatters || Formatters;
