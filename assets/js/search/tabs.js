/**
 * @description Handles tabs switching.
 * @param {String} selector Element selector (any valid css selector).
 */
function Tabs(selector) {
    this.container = document.querySelector(selector);
    this.tabs = this.container.querySelectorAll('[role="tab"]');
    this.panels = this.container.querySelectorAll('[role="tabpanel"]');

    this.bindEvents = this.bindEvents.bind(this);
    this.clickTab = this.clickTab.bind(this);

    this.bindEvents();
}

Tabs.prototype.bindEvents = function() {
    this.tabs.forEach(function(tab) {
        tab.addEventListener('click', this.clickTab.bind(null, tab));
    }.bind(this));
};

Tabs.prototype.clickTab = function(tab) {
    this._deactivateTabs();

    this._activateTab(tab);
};

Tabs.prototype._deactivateTabs = function() {
    this.tabs.forEach(function(tab) {
        tab.setAttribute('tabindex', '-1');
        tab.setAttribute('aria-selected', 'false');
    });

    this.panels.forEach(function(panel) {
        panel.setAttribute('hidden', 'hidden');
    });
};

Tabs.prototype._activateTab = function(tab) {
    tab.removeAttribute('tabindex');
    tab.setAttribute('aria-selected', 'true');

    var controls = tab.getAttribute('aria-controls');
    this.container.querySelector('#' + controls).removeAttribute('hidden');

};

window.Tabs = window.Tabs || Tabs;
