function openingHoursHandler(fuzzyResult) {
    var formattedDays = [];

    if (fuzzyResult.poi.openingHours) {
        fuzzyResult.poi.openingHours.timeRanges.forEach(function(range) {
            var day = {};
            day.date = Formatters.dateStringToObject(range.startTime.date);
            day.startTime = Formatters.formatToShortenedTimeString(
                moment().hour(range.startTime.hour).minute(range.startTime.minute)
            );
            day.endTime = Formatters.formatToShortenedTimeString(
                moment().hour(range.endTime.hour).minute(range.endTime.minute)
            );
            formattedDays.push(day);
        });

        return createDaysRanges(formattedDays);
    }
}

function formatDay(day) {
    return moment(day.date).format('ddd');
}

function getHoursRangeHTML(daysRange, openingHours) {
    return '<div class="hours-range">' +
        daysRange + ' <span class="time-range">' + openingHours + '</span>' +
    '</div>';
}

function createDaysRanges(days) {
    var finalItem = document.createElement('div');
    finalItem.classList.add('hours-container');

    if (days.length === 1) {
        finalItem.innerHTML += getHoursRangeHTML('Mon-Sun', '24h');
        return finalItem;
    }

    var sortedDays = days.sort(function(first, second) {
        if (first.date.getDay() === 0) {
            return 1;
        } else if (second.date.getDay() === 0) {
            return -1;
        }
        return first.date.getDay() - second.date.getDay();
    });

    var openingHoursMap = {};
    sortedDays.forEach(function(day) {
        var range = day.startTime + ' - ' + day.endTime;
        if (!openingHoursMap[range]) {
            openingHoursMap[range] = [];
        }
        openingHoursMap[range].push(day);
    });

    Object.keys(openingHoursMap).forEach(function(openingHours) {
        var days = openingHoursMap[openingHours];

        var previousDay;
        var daysRange;

        days.forEach(function(currentDay, index) {
            if (index === 0) {
                daysRange = formatDay(currentDay);
            } else if (currentDay.date.getDay() !== previousDay.date.getDay() + 1) {
                daysRange += '-' + formatDay(previousDay) + ', ' + formatDay(currentDay);
            } else if (index === days.length - 1) {
                daysRange += '-' + formatDay(currentDay);
            }
            previousDay = currentDay;
        });

        finalItem.innerHTML += getHoursRangeHTML(daysRange, openingHours);
    });

    return finalItem;
}

window.openingHoursHandler = window.openingHoursHandler || openingHoursHandler;
