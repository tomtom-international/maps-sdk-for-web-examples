/**
 * LayerManager
 * @constructor
 * @param mapInstance
 */
function LayerManager(mapInstance) {
    this._mapInstance = mapInstance;
    this._previousLayer = null;
}

LayerManager.prototype.getPreviousLayer = function () {
    return this._previousLayer;
};

LayerManager.prototype.removeLayer = function (layer) {
    this._mapInstance.removeLayer(layer.id);
    this._mapInstance.removeSource(layer.id);
};

LayerManager.prototype.hasLayer = function (layer) {
    return this._mapInstance.getSource(layer && layer.id) && this._mapInstance.getLayer(layer && layer.id);
};

LayerManager.prototype.updateLayer = function (layer) {
    var executor = function (resolve, reject) {
        var onStyleData = function () {
            try {
                if (this._previousLayer && this._previousLayer.id !== layer.id) {
                    if (this.hasLayer(this._previousLayer)) {
                        this.removeLayer(this._previousLayer);
                    }
                }
            } catch (event) {
                reject(event);
            }

            this._previousLayer = layer;
            if (this.hasLayer(layer)) {
                resolve();
            }
        };

        if (this.hasLayer(layer)) {
            resolve();
            return;
        }

        this._mapInstance.addLayer(layer);
        this._mapInstance.once('styledata', onStyleData.bind(this));
    };

    return new Promise(executor.bind(this));
};
