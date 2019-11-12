
/**
 * @description Creates a popup with a message.
 * @param {String="error","info"} type The type of popup depending on the use-case.
 * @param {String="bottom-center"} position The position in the map.
 * @param {Number} duration The delay after which the popup is hidden.
 */
function InfoHint(type, position, duration) {
    this.type = type;
    this.position = position;
    this.duration = duration;

    this.element = this._createElement();
}

InfoHint.prototype.addTo = function(container) {
    container.appendChild(this.element);

    return this;
};

InfoHint.prototype.hide = function() {
    this.element.classList.add('-hidden');
};

InfoHint.prototype.show = function() {
    this.element.classList.remove('-hidden');
};

InfoHint.prototype.setMessage = function(message) {
    this.show();
    this.element.innerText = message;

    if (this.timeout) {
        window.clearTimeout(this.timeout);
    }

    this.timeout = window.setTimeout(this.hide.bind(this), this.duration);
};

InfoHint.prototype._createElement = function() {
    var element = document.createElement('div');
    element.setAttribute('class', this._getClassList());

    return element;
};

InfoHint.prototype._getClassList = function() {
    var classes = [
        'tt-info-hint',
        '-hidden',
        '-' + this.position,
        '-' + this.type
    ];

    return classes.join(' ');
};

window.infoHint = window.InfoHint || InfoHint;
