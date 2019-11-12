//eslint-disable-next-line
function AntimeridianHandler() {};

/**
 * Normalize a bounding box.
 * @param {LngLatBounds} lngLatBounds
 * @return {LngLatBounds}
 */
AntimeridianHandler.prototype.normalizeBoundingBox = function (lngLatBounds) {
    var south = lngLatBounds.getSouth(),
        west = lngLatBounds.getWest(),
        north = lngLatBounds.getNorth(),
        east = west + this._difference(lngLatBounds.getEast(), west);

    return new window.tt.LngLatBounds([
        [ west, south ],
        [ east, north ]
    ]);
};

/**
 * Difference (angular) between two angles.
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
AntimeridianHandler.prototype._difference = function (a, b) {
    return 180 - Math.abs(Math.abs(a - b) - 180);
};
