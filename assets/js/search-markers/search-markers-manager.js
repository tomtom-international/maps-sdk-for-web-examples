function checkDependencyAvailability() {
    if (!window.tt) {
        throw new Error('tt is not available');
    }
    if (!window.SearchMarker) {
        throw new Error('Search Marker is not available');
    }
}

/**
 * @class SearchMarkersManager
 * @param {Object} [map] Instance of a Tomtom map.
 * @param {Object} [options] Options to customize the rendered markers.
 * @param {String} [options.markerClassName] Optional - CSS class name to customize marker styles.
 * @param {String} [options.popupClassName] Optional - CSS class name to customize marker styles.
 * @param {Function} [options.customMarkerCallback] Optional - Custom callback to render a different element for markers.
 * @param {Function} [options.customPopupCallback] Optional - Custom callback to render a different element for popups.
 *
 * This class draws markers on the map for a group of search results originating from the Tomtom Search service.
 * tt (tomtom object) needs to be available globally to use this Class.
 *
 * Make sure you also include:
 * - search-marker.js (included in our examples)
 * - search-markers.css (included in our examples)
 * - poi-icons.css (shipped with the SDK)
 */
function SearchMarkersManager(map, options) {
    checkDependencyAvailability();

    if (!map || typeof map !== 'object') {
        throw new Error('map is not valid');
    }

    this.map = map;
    this._options = options || {};
    this._poiList = undefined;
    this.markers = [];
}

/**
 * @method draw
 * @param {Array} [poiList] List of Tomtom Search Service results
 */
SearchMarkersManager.prototype.draw = function(poiList) {
    if(!(poiList && Array.isArray(poiList))) {
        throw new Error('Poi list(poiList) must be an array');
    }
    this._poiList = poiList;

    this.clear();

    this._poiList.forEach((poi) => {
        var poiOpts = {
            name: poi.poi ? poi.poi.name: undefined,
            address: poi.address.freeformAddress + ', ' + poi.address.countryCodeISO3,
            distance: poi.dist,
            classification: poi.poi ? poi.poi.classifications[0].code : undefined,
            position: poi.position
        };
        var marker = new window.SearchMarker(poiOpts, this._options);
        marker.addTo(this.map);
        this.markers.push(marker);
    });
};

SearchMarkersManager.prototype.clear = function() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
};

window.SearchMarkersManager = window.SearchMarkersManager || SearchMarkersManager;

