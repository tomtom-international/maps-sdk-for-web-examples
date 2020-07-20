function Popup() {
    this._header = this._createHeader();
    this._closeButton = this._createCloseButton();
    this._contentContainer = this._createContentContainer();
    this._container = this._createContainer(
        this._header,
        this._closeButton,
        this._contentContainer
    );

    this._closeButton.addEventListener('click', this._close.bind(this));
}

Popup.prototype._close = function() {
    this._container.classList.add('-hidden');
    this._parent.classList.remove('-modal-open');
};

Popup.prototype.show = function() {
    this._container.classList.remove('-hidden');
    this._parent.classList.add('-modal-open');
};

Popup.prototype.addTitle = function(title) {
    this._header.innerText = title;
};

Popup.prototype.addContent = function(content) {
    this._contentContainer.innerHTML = content;
};

Popup.prototype._createHeader = function(title) {
    var header = document.createElement('div');
    header.className = 'tt-modal__header';
    header.innerText = title;

    return header;
};

Popup.prototype._createContentContainer = function() {
    var contentContainer = document.createElement('div');

    return contentContainer;
};

Popup.prototype._createCloseButton = function() {
    var closeButton = document.createElement('div');
    closeButton.className = 'tt-modal__close-button tt-icon -clear';

    return closeButton;
};

Popup.prototype._createContainer = function(header, closeButton, content) {
    var container = document.createElement('div');
    container.className = 'tt-modal -hidden';

    container.appendChild(header);
    container.appendChild(closeButton);
    container.appendChild(content);

    return container;
};

Popup.prototype.addTo = function(parent) {
    this._parent = parent;
    this._parent.appendChild(this._container);
};

window.Popup = window.Popup || Popup;
