/**
 * @description Handles the updating of the slider counter value.
 * @param {String|HTMLElement} selector Element selector (any valid css selector) or HTMLElement instance.
 */
function Slider(selector) {
    var container = selector instanceof HTMLElement ? selector : document.querySelector(selector);
    this.counter = container.querySelector('.js-counter');
    this.input = container.querySelector('input[type="range"]');

    this.bindEvents();
}

Slider.prototype.bindEvents = function() {
    this.input.addEventListener('change', this._updateCounterValue.bind(this));
};

Slider.prototype._updateCounterValue = function(event) {
    this.counter.innerText = event.target.value;
};

window.Slider = window.Slider || Slider;
