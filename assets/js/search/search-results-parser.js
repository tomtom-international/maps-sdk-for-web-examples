/*
* Get the result name from the response.
*/
function getResultName(result) {
    if (typeof result.poi !== 'undefined' && typeof result.poi.name !== 'undefined') {
        return result.poi.name;
    }
    return '';
};

/*
* Get the result address from the response.
*/
function getResultAddress(result) {
    if (typeof result.address !== 'undefined') {
        var address = [];

        if (typeof result.address.freeformAddress !== 'undefined') {
            address.push(result.address.freeformAddress);
        }

        if (typeof result.address.countryCodeISO3 !== 'undefined') {
            address.push(result.address.countryCodeISO3);
        }

        return address.join(', ');
    }
    return '';
};


/**
 * Get the result distance from the search center.
 */
function getResultDistance(result) {
    if (typeof result.dist !== 'undefined') {
        return result.dist;
    }

    return '';
};

var SearchResultsParser = {
    getResultName: getResultName,
    getResultAddress: getResultAddress,
    getResultDistance
};

window.SearchResultsParser = window.SearchResultsParser || SearchResultsParser;
