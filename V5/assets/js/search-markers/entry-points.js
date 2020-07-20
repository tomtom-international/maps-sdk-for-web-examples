var ENTRY_POINTS_CONNECTORS_SOURCE_NAME = 'entry-points-connectors';

function createGeoJsonFeaturesCollection() {
    return {
        'type': 'FeatureCollection',
        'features': []
    };
}

function createGeoJsonLine(from, to) {
    return {
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': [from, to]
        }
    };
}

function EntryPoints(poiData, poiMarker, options) {
    if (!options.reverseGeocodeService) {
        throw new Error('In order to show entry points, you need to pass reverseGeocode service');
    }
    this.options = options;
    this.poiData = poiData;
    this.poiMarker = poiMarker;
    this.reverseGeocodeService = options.reverseGeocodeService;
    this.entryPointsMarkers = [];
    this.draw();
}

EntryPoints.prototype.draw = function() {
    this._drawCounter();
    this.poiMarker.addEventListener('click', this.mainMarkerClick.bind(this));
};

EntryPoints.prototype.clearEntryPoints = function() {
    this.entryPointsMarkers.forEach(function(marker) {
        marker.remove();
        this.map.getSource(ENTRY_POINTS_CONNECTORS_SOURCE_NAME).setData(createGeoJsonFeaturesCollection());
    }, this);
};

EntryPoints.prototype._drawCounter = function() {
    var entryPointsCounter = document.createElement('div');
    entryPointsCounter.className = 'entry-points-counter';
    entryPointsCounter.innerText = String(this.poiData.entryPoints.length);
    this.poiMarker.appendChild(entryPointsCounter);
};

EntryPoints.prototype.getEntryPointsAddresses = function() {
    var batchItems = this.poiData.entryPoints.map(function(entryPoint) {
        return { position: entryPoint.position.lng + ',' + entryPoint.position.lat };
    });
    return this.reverseGeocodeService({
        batchItems: batchItems
    }).go().then(function(addresses) {
        for (var i = 0; i < addresses.length; i++) {
            this.poiData.entryPoints[i].address = addresses[i].addresses[0].address;
        }
    }.bind(this));
};

EntryPoints.prototype.mainMarkerClick = function() {
    if (this._onClickCallback) {
        this._onClickCallback(this);
    }
    this.getEntryPointsAddresses().then(function() {
        this.renderEntryPoints();
    }.bind(this));
};

EntryPoints.prototype.renderEntryPoints = function() {
    var parentMarkerPosition = [this.poiData.position.lng, this.poiData.position.lat];
    var featuresCollection = createGeoJsonFeaturesCollection();
    if (this.entryPointsMarkers.length === 0) {
        this.poiData.entryPoints.forEach(function(entryPoint) {
            var entryPointMarker = this.createEntryPointMarker(entryPoint);
            featuresCollection.features.push(createGeoJsonLine(parentMarkerPosition, [
                entryPoint.position.lng,
                entryPoint.position.lat
            ]));
            entryPointMarker.addTo(this.map);
            this.entryPointsMarkers.push(entryPointMarker);
        }, this);
    } else {
        for (var entryPointsMarker in this.entryPointsMarkers) {
            var marker = this.entryPointsMarkers[entryPointsMarker];
            marker.remove();
        }
        this.entryPointsMarkers.splice(0);
    }
    this.map.getSource(ENTRY_POINTS_CONNECTORS_SOURCE_NAME).setData(featuresCollection);
};

EntryPoints.prototype.bindMap = function(map) {
    this.map = map;
};

EntryPoints.prototype.createEntryPointMarker = function(entryPoint) {
    var entryPointsMarker = new tt.Marker({
        element: this.renderEntryPointMarkerElem(),
        anchor: 'bottom'
    });
    var poiData = {
        name: this.poiData.name,
        address: entryPoint.address.freeformAddress + ', ' + entryPoint.address.countryCodeISO3,
        classification: this.poiData.classification,
        position: entryPoint.position,
        type: entryPoint.type
    };
    entryPointsMarker.setPopup(new window.SearchMarkerPopup(poiData, this.options));
    entryPointsMarker.setLngLat(entryPoint.position);
    return entryPointsMarker;
};

EntryPoints.prototype.renderEntryPointMarkerElem = function() {
    var elem = document.createElement('div');
    elem.className = 'tt-entry-point-marker';

    var icon = document.createElement('div');
    icon.className = 'icon tt-icon-ic_entry_point';
    elem.appendChild(icon);

    var pointer = document.createElement('div');
    pointer.className = 'pointer';
    icon.appendChild(pointer);

    return elem;
};

window.EntryPoints = window.EntryPoints || EntryPoints;
