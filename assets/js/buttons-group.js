function ButtonsGroup(element) {
    this.buttons = {};
    this._callbacks = [];

    this._setup(element);
    this._bindEvents(element);

    this.unselect = this.unselect.bind(this);
    this.onSelect = this.onSelect.bind(this);
}

ButtonsGroup.prototype._bindEvents = function(element) {
    element.addEventListener('click', function(event) {
        event.preventDefault();
        var target = event.target;
        if (!target.classList.contains('tt-buttons-group__button')) {
            return;
        }

        if (!target.disabled) {
            this.unselect();

            target.classList.add('-active');

            this._callbacks.forEach(function(callback) {
                callback(target);
            });
        }
    }.bind(this));
};

ButtonsGroup.prototype._setup = function(element) {
    var children = element.children;
    for (var i=0; i < children.length; i++) {
        var id = children[i].getAttribute('data-id');

        this.buttons[id] = children[i];
    }
};

ButtonsGroup.prototype.unselect = function() {
    for (var button in this.buttons) {
        this.buttons[button].classList.remove('-active');
    }
};

ButtonsGroup.prototype.onSelect = function(newCallback) {
    var isNew = true;
    this._callbacks.forEach(function(callback) {
        if (callback === newCallback) {
            isNew = false;
        }
    });

    if (isNew) {
        this._callbacks.push(newCallback);
    }
};

ButtonsGroup.prototype.disable = function(element) {
    this.buttons[element].disabled = true;
};

ButtonsGroup.prototype.enable = function(element) {
    this.buttons[element].disabled = false;
};

ButtonsGroup.prototype.select = function(element) {
    this.buttons[element].classList.add('-active');
    this.buttons[element].click();
};

window.ButtonsGroup = window.ButtonsGroup || ButtonsGroup;
