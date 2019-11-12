/**
 * @description Makes the side-panel foldable.
 * @param {String} selector Element selector (any valid css selector).
 * @param {Object} map Map Instance
 */
function SidePanel(selector, map) {
    this.map = map;
    this.element = document.querySelector(selector);
    this.unfoldButton = this.createRevealPanel();

    this.element.appendChild(this.createFooter());

    this.isFolded = false;
}

SidePanel.prototype.toggleSidePanel = function() {
    this.element.classList.toggle('-folded');

    if (this.isFolded) {
        this.unfoldButton.remove();
    } else {
        document.getElementById('map').appendChild(this.unfoldButton);
    }

    this.isFolded = !this.isFolded;
    this.map.resize();
};

SidePanel.prototype.createRevealPanel = function() {
    var element = document.createElement('div');
    var iconElement = document.createElement('div');
    element.setAttribute('class', 'tt-reveal-side-panel');
    iconElement.setAttribute('class', 'tt-icon -fold');
    iconElement.addEventListener('click', this.toggleSidePanel.bind(this));

    element.appendChild(iconElement);

    return element;
};

SidePanel.prototype.createFooter = function() {
    var element = document.createElement('div');
    var iconElement = document.createElement('div');
    element.setAttribute('class', 'tt-side-panel__footer');
    iconElement.setAttribute('class', 'tt-side-panel__close-button tt-icon -fold');
    iconElement.addEventListener('click', this.toggleSidePanel.bind(this));

    element.appendChild(iconElement);

    return element;
};

window.SidePanel = window.SidePanel || SidePanel;
