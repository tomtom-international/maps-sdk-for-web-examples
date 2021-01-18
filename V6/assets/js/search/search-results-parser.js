function getAddressLines(result) {
    var type = result.type;
    var poi = result.poi;
    var address = result.address;
    var entityType = result.entityType;

    if (type === 'Point Address' || type === 'Address Range' || type === 'Cross Streets') {
        return [address.freeformAddress, `${address.municipality}, ${address.country}`];
    } else if (type === 'POI') {
        return [poi.name, address.freeformAddress];
    } else if (type === 'Street') {
        return [address.streetName, `${address.postalCode || ''} ${address.municipality || ''}`];
    } else if (type === 'Geography') {
        switch (entityType) {
        case 'Municipality':
            return [address.municipality, address.country];
        case 'MunicipalitySubdivision':
            return [address.municipalitySubdivision, address.municipality];
        case 'Country':
            return [address.country, address.country];
        case 'CountrySubdivision':
            return [address.countrySubdivision, address.country];
        default:
            return [address.freeformAddress];
        }
    } else {
        return [address.freeformAddress];
    }
}

/*
 * Get the result distance from the search center.
 */
function getResultDistance(result) {
    if (typeof result.dist !== 'undefined') {
        return result.dist;
    }

    return '';
}

var SearchResultsParser = {
    getAddressLines: getAddressLines,
    getResultDistance: getResultDistance
};

window.SearchResultsParser = window.SearchResultsParser || SearchResultsParser;
