var tt = window.tt;

var ENTRY_POINTS_CONNECTORS_SOURCE_NAME = 'entry-points-connectors';

function createGeoJsonFeaturesCollection() {
    return {
        "type": "FeatureCollection",
        "features": []
    }
}


/**
 * @class SearchMarker
 * @param {Object} [poiData] Data used to render the marker.
 * @param {String} [poiData.name] Optional - Name of the poi.
 * @param {String} [poiData.address] Address of the poi.
 * @param {Integer} [poiData.dist] Optional - Distance of the poi to the center of the search.
 * @param {String} [poiData.classification] Classification of the poi - e.g., RESTAURANT.
 * @param {Object} [poiData.position] Position of the poi - latitude, longitude object.
 * @param {Array} [poiData.entryPoints] Optional - An array of entry points
 * @param {Object} [options] Options to make customization to the elements rendered.
 * @param {Boolean=false} [options.entryPoints] Optional - Enables/disables entry points support.
 * @param {String} [options.markerClassName] Optional - CSS class name to customize marker styles.
 * @param {String} [options.popupClassName] Optional - CSS class name to customize marker styles.
 * @param {Function} [options.customMarkerCallback] Optional - Custom callback to render a different element for markers.
 * @param {Function} [options.customPopupCallback] Optional - Custom callback to render a different element for popups.
 *
 * This Class can be used to generate the default Tomtom search result markers.
 * Make sure you include:
 * - search-markers.css (included in our examples)
 * - poi-icons.css (shipped with the SDK and also available via CDN - check our downloads page)
 */
function SearchMarker(poiData, options) {
    this._poiData = poiData;
    this._options = options || {};
    this._marker = new tt.Marker({
        element: renderSearchMarkerElem.call(this),
        anchor: 'bottom'
    });
    this._marker.setLngLat([
        this._poiData.position.lng,
        this._poiData.position.lat
    ]);
    setPopup.call(this);
}

// public methods
SearchMarker.prototype.addTo = function(map) {
    this._marker.addTo(map);
    this._map = map;
    return this;
};

SearchMarker.prototype.remove = function() {
    this._marker.remove();
    this.clearEntryPoints();
    this._map = null;
    this._onClickCallback = null;
};

SearchMarker.prototype.getLngLat = function() {
    return this._marker.getLngLat();
};

SearchMarker.prototype.getPopup = function() {
    return this._marker.getPopup();
};

SearchMarker.prototype.togglePopup = function() {
    return this._marker.togglePopup();
};

SearchMarker.prototype.onClick = function(callback) {
    this._onClickCallback = callback;
};

SearchMarker.prototype.clearEntryPoints = function() {
    if (this._entryPointsMarkers && this._entryPointsMarkers.length > 0) {
        for (var entryPointsMarker of this._entryPointsMarkers) {
            entryPointsMarker.remove();
        }
        this._entryPointsMarkers = null;
        this._map.getSource(ENTRY_POINTS_CONNECTORS_SOURCE_NAME).setData(createGeoJsonFeaturesCollection());
    }
};

// private methods
function getPopup(poiData, options) {
    return  new tt.Popup({
        offset: [0, -38]
    }).setDOMContent(createPopupContent(poiData, options));
}

function setPopup() {
    this._marker.setPopup(getPopup(this._poiData, this._options));
}

function createPopupContent(poiData, options) {
    if (options.customPopupCallback) {
        return renderCustomElement.call(this, options.customPopupCallback);
    }

    var popupParentElem = document.createElement('div');
    popupParentElem.className = 'tt-pop-up-container';

    if (options.popupClassName) {
        popupParentElem.className += ' ' + options.popupClassName;
    }

    var popupIconContainer = document.createElement('div');
    popupIconContainer.className = 'pop-up-icon';
    var iconElem = document.createElement('div');
    iconElem.className = getIcon('black', poiData);
    popupIconContainer.appendChild(iconElem);

    var popupContentElem = document.createElement('div');
    popupContentElem.className = 'pop-up-content';

    if (poiData.name) {
        createDivWithContent('pop-up-result-name', poiData.name, popupContentElem);
    }

    createDivWithContent('pop-up-result-address', poiData.address, popupContentElem);

    if (poiData.distance) {
        createDivWithContent('pop-up-result-distance', convertDistance(poiData.distance), popupContentElem);
    }

    createDivWithContent('pop-up-result-position', `${poiData.position.lat}, ${poiData.position.lon ? poiData.position.lon : poiData.position.lng}`, popupContentElem);

    if (poiData.type) {
        createDivWithContent('pop-up-result-type', `${poiData.type} entry`, popupContentElem);
    }

    popupParentElem.appendChild(popupIconContainer);
    popupParentElem.appendChild(popupContentElem);

    return popupParentElem;
}

function createGeoJsonLine(from, to) {
    return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [from, to]
        }
    };
}

function createEntryPointMarker(entryPoint, parentPoiData, options) {
    var entryPointsMarker = new tt.Marker({
        element: renderEntryPointMarkerElem.call(this),
        anchor: 'bottom'
    });
    var poiData = {
        name: parentPoiData.name,
        address: entryPoint.address.freeformAddress + ', ' + entryPoint.address.countryCodeISO3,
        classification: parentPoiData.classification,
        position: entryPoint.position,
        type: entryPoint.type
    };
    entryPointsMarker.setPopup(getPopup(poiData, options));
    entryPointsMarker.setLngLat(entryPoint.position);
    return entryPointsMarker;
}

function renderEntryPoints(entryPointsMarkers, poiData, options, map) {
    var parentMarkerPosition = [poiData.position.lng, poiData.position.lat];
    var featuresCollection = createGeoJsonFeaturesCollection();
    if (entryPointsMarkers.length === 0) {
        poiData.entryPoints.forEach(function(entryPoint) {
            var entryPointMarker = createEntryPointMarker(entryPoint, poiData, options);
            featuresCollection.features.push(createGeoJsonLine(parentMarkerPosition, [
                entryPoint.position.lon,
                entryPoint.position.lat
            ]));
            entryPointMarker.addTo(map);
            entryPointsMarkers.push(entryPointMarker);
        });
    } else {
        for (var entryPointsMarker of entryPointsMarkers) {
            entryPointsMarker.remove();
        }
        entryPointsMarkers.splice(0);
    }
    map.getSource(ENTRY_POINTS_CONNECTORS_SOURCE_NAME).setData(featuresCollection);
}

function renderEntryPointMarkerElem() {
    var elem = document.createElement('div');
    elem.className = 'tt-entry-point-marker';

    var icon = document.createElement('div');
    icon.className = 'icon tt-icon-ic_entry_point';
    elem.append(icon);

    var pointer = document.createElement('div');
    pointer.className = 'pointer';
    icon.append(pointer);

    return elem;
}

function enableSupportForEntryPointsIfNecessary(elem) {
    if (this._options.entryPoints && this._poiData.entryPoints) {
        var entryPointsCounter = document.createElement('div');
        entryPointsCounter.className = 'entry-points-counter';
        entryPointsCounter.innerText = '' + this._poiData.entryPoints.length;
        elem.appendChild(entryPointsCounter);
        elem.addEventListener('click', function() {
            if (this._onClickCallback) {
                this._onClickCallback(this);
            }
            if (this._options.reverseGeocodeService) {
                var batchItems = this._poiData.entryPoints.map(function(entryPoint) {
                    return { position: `${entryPoint.position.lon},${entryPoint.position.lat}`};
                });
                var that = this;
                this._options.reverseGeocodeService({
                    batchItems: batchItems
                }).go().then(function(addresses) {
                    for (var i = 0; i < addresses.length; i++) {
                        that._poiData.entryPoints[i].address = addresses[i].addresses[0].address;
                    }
                    if(!that._entryPointsMarkers) {
                        that._entryPointsMarkers = [];
                    }
                    renderEntryPoints(that._entryPointsMarkers, that._poiData, that._options, that._map);
                });
            }
        }.bind(this));
    }
}

function renderSearchMarkerElem() {
    if (this._options.customMarkerCallback) {
        return renderCustomElement.call(this, this._options.customMarkerCallback);
    }

    var elem = document.createElement('div');
    elem.className = 'tt-icon-marker-black tt-search-marker';
    if (this._options.markerClassName) {
        elem.className += ' ' + this._options.markerClassName;
    }

    var innerElem = document.createElement('div');
    innerElem.className = 'marker-inner ' + getIcon('white', this._poiData);

    elem.appendChild(innerElem);
    enableSupportForEntryPointsIfNecessary.call(this, elem);
    return elem;
}

function renderCustomElement(customElemCallback) {
    if (typeof customElemCallback !== 'function') {
        throw new Error('customElemCallback must be a function');
    }
    var customElem = customElemCallback(this._poiData);
    if (!(customElem instanceof window.HTMLElement)) {
        throw new Error('customElemCallback must return a HTML element');
    }
    return customElem;
}

function getIconClassModifier(iconClass) {
    var classParts = iconClass.split('-');
    return classParts.length > -1 ? classParts.slice(-1)[0] : undefined;
}

function getIconClassWithoutModifier(iconClass) {
    return iconClass.split('-').slice(0, -1).join('-');
}

function isColorModifier(modifier) {
    return ['white', 'black'].indexOf(modifier) > -1;
}

function getIcon(color, poiData) {
    var iconClass = availableIcons['fallback'];

    if (poiData.classification) {
        var icon = availableIcons[poiData.classification];
        if (icon) {
            iconClass = icon;
        }
    }

    var modifier = getIconClassModifier(iconClass);
    if (modifier && isColorModifier(modifier)) {
        return 'tt-icon-' + getIconClassWithoutModifier(iconClass) + '-' + color;
    }

    return 'tt-icon-' + iconClass;
}

// utilities
function convertDistance(distanceMeters) {
    if (distanceMeters < 1000) {
        return Math.ceil(distanceMeters) + ' m';
    }
    return Math.ceil(distanceMeters / 1000) + ' km';
}

function createDivWithContent(className, content, parent) {
    var elem = document.createElement('div');
    elem.className = className;
    elem.appendChild(document.createTextNode(content));
    parent.appendChild(elem);
}

// default tomtom icons - css mappings
// To use these icons make sure you include the file 'poi-icons.css' that is shipped with our SDK
// Please refer to the getIcon function to see how they are used
var availableIcons = {
    fallback: 'flag-white',
    ACCESS_GATEWAY: 'ic_map_poi_110-white',
    ADMINISTRATIVE_DIVISION: 'ic_map_poi_133-white',
    ADVENTURE_SPORTS_VENUE: 'ic_map_poi_122-white',
    AGRICULTURE: 'ic_map_poi_107-white',
    AIRPORT: 'ic_map_poi_007-white',
    AMUSEMENT_PARK: 'ic_map_poi_051-white',
    AUTOMOTIVE_DEALER: 'ic_map_poi_008-white',
    BANK: 'ic_map_poi_077-white',
    BEACH: 'ic_map_poi_043-white',
    BUILDING_POINT: 'ic_map_poi_132-white',
    BUSINESS_PARK: 'ic_map_poi_102-white',
    CAFE_PUB: 'ic_map_poi_120-white',
    CAMPING_GROUND: 'ic_map_poi_058-white',
    CAR_WASH: 'ic_map_poi_067-white',
    CASH_DISPENSER: 'ic_map_poi_042-white',
    CASINO: 'ic_map_poi_009-white',
    CINEMA: 'ic_map_poi_011-white',
    CITY_CENTER: 'ic_map_poi_012-white',
    CLUB_ASSOCIATION: 'ic_map_poi_131-white',
    COLLEGE_UNIVERSITY: 'ic_map_poi_041-white',
    COMMERCIAL_BUILDING: 'ic_map_poi_098-white',
    COMMUNITY_CENTER: 'ic_map_poi_081-white',
    COMPANY: 'ic_map_poi_013-white',
    COURTHOUSE: 'ic_map_poi_015-white',
    CULTURAL_CENTER: 'ic_map_poi_016-white',
    DENTIST: 'ic_map_poi_048-white',
    DEPARTMENT_STORE: 'ic_map_poi_104-white',
    DOCTOR: 'ic_map_poi_047-white',
    ELECTRIC_VEHICLE_STATION: 'ic_map_poi_073-white',
    EMBASSY: 'ic_map_poi_040-white',
    EMERGENCY_MEDICAL_SERVICE: 'ic_map_poi_115-white',
    ENTERTAINMENT: 'ic_map_poi_035-white',
    EXCHANGE: 'ic_map_poi_096-white',
    EXHIBITION_CONVENTION_CENTER: 'ic_map_poi_017-white',
    FERRY_TERMINAL: 'ic_map_poi_018-white',
    FIRE_STATION_BRIGADE: 'ic_map_poi_068-white',
    FRONTIER_CROSSING: 'ic_map_poi_019-white',
    FUEL_FACILITIES: 'ic_map_poi_004-white',
    GEOGRAPHIC_FEATURE: 'ic_map_poi_127-white',
    GOLF_COURSE: 'ic_map_poi_020-white',
    GOVERNMENT_OFFICE: 'ic_map_poi_000-white',
    HEALTH_CARE_SERVICE: 'ic_map_poi_116-white',
    HELIPAD_HELICOPTER_LANDING: 'ic_map_poi_123-white',
    HOLIDAY_RENTAL: 'ic_map_poi_130-white',
    HOSPITAL_POLYCLINIC: 'ic_map_poi_021-white',
    HOTEL_MOTEL: 'ic_map_poi_022-white',
    ICE_SKATING_RINK: 'ic_map_poi_044-white',
    IMPORTANT_TOURIST_ATTRACTION: 'ic_map_poi_023-white',
    INDUSTRIAL_BUILDING: 'ic_map_poi_095-white',
    LEISURE_CENTER: 'ic_map_poi_061-white',
    LIBRARY: 'ic_map_poi_052-white',
    MANUFACTURING_FACILITY: 'ic_map_poi_099-white',
    MARINA: 'ic_map_poi_062-white',
    MARKET: 'ic_map_poi_118-white',
    MEDIA_FACILITY: 'ic_map_poi_101-white',
    MILITARY_INSTALLATION: 'ic_map_poi_106-white',
    MOTORING_ORGANIZATION_OFFICE: 'ic_map_poi_076-white',
    MOUNTAIN_PASS: 'ic_map_poi_024-white',
    MUSEUM: 'ic_map_poi_025-white',
    NATIVE_RESERVATION: 'ic_map_poi_125-white',
    NIGHTLIFE: 'ic_map_poi_050-white',
    NON_GOVERNMENTAL_ORGANIZATION: 'ic_map_poi_134-white',
    OPEN_PARKING_AREA: 'ic_map_poi_002',
    OTHER: 'flag-white',
    PARKING_GARAGE: 'ic_map_poi_003',
    PARK_RECREATION_AREA: 'ic_map_poi_059-white',
    PETROL_STATION: 'ic_map_poi_004-white',
    PHARMACY: 'ic_map_poi_054-white',
    PLACE_OF_WORSHIP: 'ic_map_poi_027-white',
    POLICE_STATION: 'ic_map_poi_039-white',
    PORT_WAREHOUSE_FACILITY: 'ic_map_poi_105-white',
    POST_OFFICE: 'ic_map_poi_028-white',
    PRIMARY_RESOURCE_UTILITY: 'ic_map_poi_108-white',
    PRISON_CORRECTIONAL_FACILITY: 'ic_map_poi_094-white',
    PUBLIC_AMENITY: 'ic_map_poi_097-white',
    PUBLIC_TRANSPORT_STOP: 'ic_map_poi_069-white',
    RAILWAY_STATION: 'ic_map_poi_005-white',
    RENT_A_CAR_FACILITY: 'ic_map_poi_029-white',
    RENT_A_CAR_PARKING: 'ic_map_poi_030',
    REPAIR_FACILITY: 'ic_map_poi_053-white',
    RESEARCH_FACILITY: 'ic_map_poi_100-white',
    RESIDENTIAL_ACCOMMODATION: 'ic_map_poi_075-white',
    RESTAURANT: 'ic_map_poi_031-white',
    RESTAURANT_AREA: 'ic_map_poi_031-white',
    REST_AREA: 'ic_map_poi_006-white',
    SCENIC_PANORAMIC_VIEW: 'ic_map_poi_055-white',
    SCHOOL: 'ic_map_poi_070-white',
    SHOP: 'ic_map_poi_032-white',
    SHOPPING_CENTER: 'ic_map_poi_033-white',
    SPORTS_CENTER: 'ic_map_poi_038-white',
    STADIUM: 'ic_map_poi_034-white',
    SWIMMING_POOL: 'ic_map_poi_046-white',
    TENNIS_COURT: 'ic_map_poi_045-white',
    THEATER: 'ic_map_poi_035-white',
    TOURIST_INFORMATION_OFFICE: 'ic_map_poi_023-white',
    TRAFFIC_LIGHT: 'ic_map_poi_129-white',
    TRAFFIC_SERVICE_CENTER: 'ic_map_poi_126-white',
    TRAFFIC_SIGN: 'ic_map_poi_128-white',
    TRAIL_SYSTEM: 'ic_map_poi_124-white',
    TRANSPORT_AUTHORITY_VEHICLE_REGISTRATION: 'ic_map_poi_113-white',
    TRUCK_STOP: 'ic_map_poi_071',
    VETERINARIAN: 'ic_map_poi_049-white',
    WATER_SPORT: 'ic_map_poi_046-white',
    WEIGH_STATION: 'ic_map_poi_111-white',
    WELFARE_ORGANIZATION: 'ic_map_poi_117-white',
    WINERY: 'ic_map_poi_057-white',
    ZOOS_ARBORETA_BOTANICAL_GARDEN: 'ic_map_poi_037'
};

window.SearchMarker = window.SearchMarker || SearchMarker;

