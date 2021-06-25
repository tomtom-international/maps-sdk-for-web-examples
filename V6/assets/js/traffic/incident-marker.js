function IncidentMarker(options) {
    this.onSelected = options.onSelected;
    this.iconsMapping = options.iconsMapping;
    this.incidentSeverity = options.incidentSeverity;

    this._marker = null;
}

IncidentMarker.prototype._validateSeverity = function(properties) {
    return properties && properties.magnitudeOfDelay;
};

IncidentMarker.prototype._validateIconCategory = function(properties) {
    return properties && properties.iconCategory || 'Unknown';
};

IncidentMarker.prototype._validateEvent = function(properties) {
    return properties && properties.events;
};

IncidentMarker.prototype._validateTime = function(properties) {
    return properties && window.formatters.formatToDurationTimeString(properties.delay);
};

IncidentMarker.prototype._validateDistance = function(properties) {
    return properties.length &&
    window.formatters.formatAsMetricDistance(properties.length);
};

IncidentMarker.prototype._validateRoadNumber = function(properties) {
    return properties && properties.roadNumbers;
};

IncidentMarker.prototype._validateAndParseEndTime = function(properties) {
    var endTime = properties && properties.endTime;

    if (endTime) {
        return window.Formatters.formatToDateTimeStringForTrafficIncidents(endTime);
    }
};

IncidentMarker.prototype._createPopupHeader = function() {
    return ['Category', 'Streets', 'Length', 'Est. end time'].map(function(text) {
        return '<div>' + text + '</div>';
    }).join('');
};

IncidentMarker.prototype._createPopupContent = function(feature) {
    var properties = feature.properties;

    var severity = this._validateSeverity(properties);
    var iconCategory = this._validateIconCategory(properties);
    var event = this._validateEvent(properties);
    var time = this._validateTime(properties);
    var distance = this._validateDistance(properties);
    var roadNumber = this._validateRoadNumber(properties);
    var estimatedEndTime = this._validateAndParseEndTime(properties);

    var wrapper = DomHelpers.elementFactory('div');

    wrapper.innerHTML = '<div class="tt-traffic-details">' +
        '<div class="tt-traffic-details__header">' +
            '<div class="tt-traffic-icon">' +
                    '<div class="tt-icon-circle-' + this.incidentSeverity[severity] + '">' +
                        '<div class="tt-icon-' + this.iconsMapping[iconCategory] + '"></div>' +
                    '</div>' +
                '</div>' +

            (roadNumber ? '<div class="tt-road-shield">' + roadNumber + '</div>' : '') +

            (event ? '<div class="tt-incident-category">' + event[0].description + '</div>' : '') +
            '</div>' +
        '</div>' +

        '<div class="tt-traffic-description">' +
            (time ? '<div class="tt-incident-delay">' +
                (time === 'No delay' ? '<b>' + time + '</b>' : '<b>Delay: </b>' + time) +
            '</div>' : '') +

            (distance ? '<div class="tt-incident-length"><b>Traffic length: </b>' + distance + '</div>' : '') +

            (estimatedEndTime ? '<div class="tt-incident-end-time"><b>Estimated end time: </b>' +
                estimatedEndTime +
            '</div>' : '') +
        '</div>' +
    '</div>';

    return wrapper;
};

IncidentMarker.prototype.markerFactory = function(feature) {
    var outerEl = document.createElement('div');
    outerEl.className = 'tt-icon-marker tt-icon-circle-' + this.incidentSeverity[feature.properties.magnitudeOfDelay];
    var popup = new tt.Popup({ offset: 15 })
        .setMaxWidth('none');

    var innerEl = document.createElement('div');
    innerEl.className = 'tt-icon-marker-inner';

    var marker = new tt.Marker({
        anchor: 'center',
        element: outerEl
    })
        .setLngLat({lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1]});

    innerEl.className += ' tt-icon-' + this.iconsMapping[feature.properties.iconCategory];
    outerEl.appendChild(innerEl);
    popup.setDOMContent(this._createPopupContent(feature));

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

    var popupContent = this._createPopupContent(feature);

    if (this._marker.getPopup()) {
        this._marker.getPopup().setDOMContent(popupContent);
    }
};

IncidentMarker.prototype.getMarker = function() {
    return this._marker;
};

window.IncidentMarker = window.IncidentMarker || IncidentMarker;
