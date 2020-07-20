
/**
 * @description Validators for complex types.
 */
var validators = {
    isNumber: function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    isNumberInInterval: function(value, min, max) {
        return value >= min && value <= max;
    },
    checkLongitude: function(value) {
        if (!validators.isNumber(value)) {
            throw new TypeError('Number is expected, but ' + value + ' [' + typeof value + '] given');
        }

        var numValue = parseFloat(value);
        if (!validators.isNumberInInterval(numValue, -180, 180)) {
            throw new TypeError('Longitude <-180,180> is expected, but ' +
                value + ' [' + typeof value + '] given');
        }
        return numValue;
    },
    checkLatitude: function(value) {
        if (!validators.isNumber(value)) {
            throw new TypeError('Number is expected, but ' + value + ' [' + typeof value + '] given');
        }

        var numValue = parseFloat(value);
        if (!validators.isNumberInInterval(numValue, -90, 90)) {
            throw new TypeError('Latitude <-90,90> is expected, but ' + value + ' [' + typeof value + '] given');
        }
        return numValue;
    }
};

window.validators = window.validators || validators;
