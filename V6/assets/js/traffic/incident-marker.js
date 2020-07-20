var incidentSeverity = {
    'major': 3,
    'moderate': 2,
    'minor': 1,
    'undefined': 0,
    'unknown': 0
};

function isDescribedAsCluster(features) {
    return Boolean(features.features && features.clusterSize);
}

function compareIncidentSeverity(a, b) {
    if (incidentSeverity[b.properties.incidentSeverity] < incidentSeverity[a.properties.incidentSeverity]) {
        return -1;
    }
    if (incidentSeverity[b.properties.incidentSeverity] > incidentSeverity[a.properties.incidentSeverity]) {
        return 1;
    }
    return b.properties.delaySeconds - a.properties.delaySeconds;
}

function IncidentMarker(options) {
    this.onSelected = options.onSelected;
    this.iconsMapping = options.iconsMapping;

    this._marker = null;
}

IncidentMarker.prototype._validateSeverity = function(properties) {
    return properties && properties.incidentSeverity || 'unknown';
};

IncidentMarker.prototype._validateIncidentCategory = function(properties) {
    return properties && properties.incidentCategory || 'Unknown';
};

IncidentMarker.prototype._validateTime = function(properties) {
    return properties && window.formatters.formatToDurationTimeString(properties.delaySeconds);
};

IncidentMarker.prototype._validateDistance = function(properties) {
    return properties.lengthMeters &&
    window.formatters.formatAsMetricDistance(properties.lengthMeters);
};

IncidentMarker.prototype._validateRoadNumber = function(properties) {
    return properties && properties.roadNumber;
};

IncidentMarker.prototype._createClusterPopupContent = function(renderData) {
    var properties = renderData.properties,
        features = properties.features,
        displayedFeatures = features.sort(compareIncidentSeverity).slice(0, 4);

    var clusterWrapper = DomHelpers.elementFactory('div', 'tt-traffic-cluster'),
        clusterHTML =
            '<div class="tt-traffic-cluster__header">INCIDENTS IN THIS AREA: ' + properties.clusterSize + '</div>' +
            '<div>' +
                '<div class="tt-traffic-cluster__list -header">' +
                    this._createPopupHeader() +
                '</div>' +
                '<div>' +
                    this._createPopupBody(displayedFeatures) +
                '</div>' +
            '</div>' +
            '<div class="tt-traffic-cluster__footer">' +
                displayedFeatures.length + ' most severe incidents (ordered by severity and delay)' +
            '</div>';

    clusterWrapper.innerHTML = clusterHTML;
    return clusterWrapper;
};

IncidentMarker.prototype._createPopupBody = function(displayedFeatures) {
    return displayedFeatures.map(function(feature) {
        return (
            '<div class="tt-traffic-cluster__item">' +
                '<div class="tt-traffic-icon">' +
                    '<div class="tt-icon-circle-' + feature.properties.incidentSeverity + ' -small">' +
                        '<div class="tt-icon-' + this.iconsMapping[feature.properties.incidentCategory] + '"></div>' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<p>From: ' + feature.properties.from + '</p>' +
                    '<p>To: ' + feature.properties.to + '</p>' +
                '</div>' +
                '<div>' + window.formatters.formatAsMetricDistance(feature.properties.lengthMeters) + '</div>' +
            '</div>'
        );
    }).join('');
};

IncidentMarker.prototype._createPopupHeader = function() {
    return ['Category', 'Streets', 'Length'].map(function(text) {
        return '<div>' + text + '</div>';
    }).join('');
};

IncidentMarker.prototype._createPopupContent = function(feature) {
    var properties = feature.properties;

    var severity = this._validateSeverity(properties);
    var incidentCategory = this._validateIncidentCategory(properties);
    var time = this._validateTime(properties);
    var distance = this._validateDistance(properties);
    var roadNumber = this._validateRoadNumber(properties);

    var wrapper = DomHelpers.elementFactory('div', 'tt-traffic-details');

    wrapper.innerHTML = '<div class="tt-traffic-details">' +
            '<div class="tt-traffic-icon">' +
                '<div class="tt-icon-circle-' + severity + '">' +
                    '<div class="tt-icon-' + this.iconsMapping[incidentCategory] + '"></div>' +
                '</div>' +
            '</div>' +
           (roadNumber ? '<div class="tt-road-shield">' + roadNumber + '</div>' : '') +
            '<div class="tt-traffic-description">' +
                '<div class="tt-incident-category">' + incidentCategory + '</div>' +
                '<div ' +
                    'class="tt-incident-delay-length" ' +
                    (!time && !distance ? 'style="display:none;"' : '') +
                '>' +
                    (time ? '<div class="tt-incident-delay">' + time + '</div>' : '') +
                    (distance ? '<div class="tt-incident-length">' + distance + '</div>' : '') +
                '</div>' +
            '</div>' +
        '</div>';

    return wrapper;
};

IncidentMarker.prototype.markerFactory = function(feature) {
    var outerEl = document.createElement('div');
    outerEl.className = 'tt-icon-marker tt-icon-circle-' + feature.properties.incidentSeverity;
    var popup = new tt.Popup({ offset: 15 })
        .setMaxWidth('none');

    var innerEl = document.createElement('div');
    innerEl.className = 'tt-icon-marker-inner';

    var marker = new tt.Marker({
        anchor: 'center',
        element: outerEl
    })
        .setLngLat({lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1]});

    if (isDescribedAsCluster(feature.properties)) {
        var clusterSize = feature.properties.clusterSize;
        innerEl.innerText = clusterSize < 100 ? clusterSize : '99+';
        outerEl.appendChild(innerEl);

        popup.setDOMContent(this._createClusterPopupContent(feature));
    } else {
        innerEl.className += ' tt-icon-' + this.iconsMapping[feature.properties.incidentCategory];
        outerEl.appendChild(innerEl);
        popup.setDOMContent(this._createPopupContent(feature));
    }

    marker.setPopup(popup);
    marker.getPopup().on('open', this.onSelected.bind(window, feature.properties.id));

    this._marker = marker;
    return marker;
};

IncidentMarker.prototype.update = function(feature) {
    if (!this._marker) {
        return;
    }

    this._marker.setLngLat(feature.geometry.coordinates);

    var popupContent = isDescribedAsCluster(feature.properties) ?
        this._createClusterPopupContent(feature) :
        this._createPopupContent(feature);

    if (this._marker.getPopup()) {
        this._marker.getPopup().setDOMContent(popupContent);
    }
};

IncidentMarker.prototype.getMarker = function() {
    return this._marker;
};

window.IncidentMarker = window.IncidentMarker || IncidentMarker;
