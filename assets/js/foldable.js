/**
 * @description Makes the element foldable.
 * @param {String} selector Element selector (any valid CSS selector).
 * @param {String="top-right"} position Position of the fold button.
 */

function Foldable(selector, position) {
    this.position = position;
    this.element = document.querySelector(selector);
    this.element.classList.add('tt-foldable');
    this.foldButton = this._createFoldButton();
    this.isFolded = false;
    this.overflowTimeout = undefined;

    this._addFoldButton();
    this._bindEvents();
}

Foldable.prototype._createFoldButton = function() {
    var foldButton = document.createElement('button');
    foldButton.setAttribute('class', 'tt-foldable__button -' + this.position);

    return foldButton;
};

Foldable.prototype._addFoldButton = function() {
    this.element.appendChild(this.foldButton);
};

Foldable.prototype._bindEvents = function() {
    this.foldButton.addEventListener('click', this._toggleFold.bind(this));
};

Foldable.prototype._toggleFold = function() {
    this.element.classList.toggle('-folded');

    if (!this.isFolded) {
        this.element.classList.add('-open');
    }

    window.clearTimeout(this.overflowTimeout);

    if (this.isFolded) {
        this.overflowTimeout = window.setTimeout(function() {
            this.element.classList.remove('-open');
        }.bind(this), 200);
    }

    this.isFolded = !this.isFolded;
};

window.Foldable = window.Foldable || Foldable;
