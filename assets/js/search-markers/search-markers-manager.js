function checkDependencyAvailability() {
    if (!window.tt) {
        throw new Error('tt is not available');
    }
    if (!window.SearchMarker) {
        throw new Error('Search Marker is not available');
    }
}

function addEntryPointsMapLayersIfNecessary(map, options) {
    if (options.entryPoints) {
        map.addSource('entry-points-connectors', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': []
            }
        });

        map.addLayer({
            id: 'entry-points-connectors',
            type: 'line',
            source: 'entry-points-connectors',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': '#000',
                'line-width': 0.5,
                'line-dasharray': [10, 10]
            },
            filter: ['in', '$type', 'LineString']
        });
    }
}
/**
 * @class SearchMarkersManager
 * @param {Object} [map] Instance of a Tomtom map.
 * @param {Object} [options] Options to customize the rendered markers.
 * @param {String} [options.markerClassName] Optional - CSS class name to customize marker styles.
 * @param {String} [options.popupClassName] Optional - CSS class name to customize marker styles.
 * @param {Boolean=false} [options.entryPoints] Optional - A flag indicating if entry points should be supported.
 * @param {Function} [options.reverseGeocodeService] Optional - A service used to fetch an address of an entry point
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
    addEntryPointsMapLayersIfNecessary(map, this._options);
}

/**
 * @method draw
 * @param {Array} [poiList] List of Tomtom Search Service results
 */
SearchMarkersManager.prototype.draw = function(poiList) {
    if (!(poiList && Array.isArray(poiList))) {
        throw new Error('Poi list(poiList) must be an array');
    }
    this._poiList = poiList;

    this.clear();

    this._poiList.forEach(function (poi) {
        var poiOpts = {
            name: poi.poi ? poi.poi.name : undefined,
            address: poi.address.freeformAddress + ', ' + poi.address.countryCodeISO3,
            distance: poi.dist,
            classification: poi.poi ? poi.poi.classifications[0].code : undefined,
            position: poi.position,
            entryPoints: poi.entryPoints
        };
        var marker = new window.SearchMarker(poiOpts, this._options);
        marker.onClick(function(clickedMarker) {
            if (this._lastClickedMarker && this._lastClickedMarker !== clickedMarker) {
                this._lastClickedMarker.clearEntryPoints();
            }
            this._lastClickedMarker = clickedMarker;
        }.bind(this));
        marker.addTo(this.map);
        this.markers.push(marker);
    }.bind(this));
};

SearchMarkersManager.prototype.clear = function() {
    this.markers.forEach(function(marker) { 
        marker.remove();
    });
    this.markers = [];
    this._lastClickedMarker = null;
};

window.SearchMarkersManager = window.SearchMarkersManager || SearchMarkersManager;

