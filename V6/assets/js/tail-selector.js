if (!window.tail) {
    throw new Error('Tail must be available globally to use the language selector.');
}

function ReplaceWithPolyfill() {
    'use-strict'; // For safari
    var parent = this.parentNode, i = arguments.length, currentNode;
    if (!parent) {
        return;
    }
    if (!i) { // if there are no arguments
        parent.removeChild(this);
    }
    //eslint-disable-next-line
    while (i--) { // i-- decrements i and returns the value of i before the decrement
        currentNode = arguments[i];
        if (typeof currentNode !== 'object') {
            currentNode = this.ownerDocument.createTextNode(currentNode);
        } else if (currentNode.parentNode) {
            currentNode.parentNode.removeChild(currentNode);
        }
        // the value of "i" below is after the decrement
        if (!i) { // if currentNode is the first argument (currentNode === arguments[0])
            parent.replaceChild(currentNode, this);
        } else { // if currentNode isn't the first
            parent.insertBefore(currentNode, this.previousSibling);
        }
    }
}
if (!Element.prototype.replaceWith) {
    Element.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!CharacterData.prototype.replaceWith) {
    CharacterData.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!DocumentType.prototype.replaceWith) {
    DocumentType.prototype.replaceWith = ReplaceWithPolyfill;
}

var TailSelector = (function() {
    function closeMultipleSelector() {
        if (this.options.multiple) {
            this.tailElem.close();
        }
    }

    function createSelectElement() {
        var selectorElem = document.createElement('select');
        selectorElem.classList = 'tt-select';
        return selectorElem;
    }

    function appendOptions(selectorElem) {
        for (var optionKey in this.selectOptions) {
            var option = document.createElement('option');
            option.value = optionKey;
            option.innerHTML = this.selectOptions[optionKey];
            selectorElem.appendChild(option);
        }
    }

    function convertToTail() {
        var tailSelect = window.tail.select(
            this.selectorElem,
            Object.assign({
                classNames: 'tt-fake-select',
                hideSelected: true
            }, this.options
            ));

        tailSelect.options.select(this.defaultKey, '#');
        return tailSelect;
    }

    function init() {
        this.selectorElem = createSelectElement.call(this);
        appendOptions.call(this, this.selectorElem);

        this.element = document.querySelector(this.selector);
        this.element.replaceWith(this.selectorElem);

        this.tailElem = convertToTail.call(this);

        this.tailElem.on('change', closeMultipleSelector.bind(this));

        this.tailElemPrototype = Object.getPrototypeOf(this.tailElem);
        extendTailElementPrototype.call(this);
    }

    function extendTailElementPrototype() {
        this.tailElemPrototype.block = function() {
            this.label.classList.add('-blocked');
        };
        this.tailElemPrototype.unblock = function() {
            this.label.classList.remove('-blocked');
        };
    }

    function TailSelector(selectOptions, selector, defaultKey, options) {
        this.selectOptions = selectOptions;
        this.defaultKey = defaultKey;
        this.options = options || {};
        this.selector = selector;

        init.call(this);
    }

    TailSelector.prototype.getElement = function() {
        return this.tailElem;
    };

    TailSelector.prototype.setValue = function(key) {
        var options = this.tailElem.options;

        for (var i = 0; i < options.length; i++) {
            if (options[i].value === key) {
                options.select(i, '#');
            }
        }
    };

    TailSelector.prototype.getSelectedOptions = function() {
        var selectElem = this.selectorElem;
        var selectedOptions = [];
        for (var i = 0; i < selectElem.length; i++) {
            if (selectElem.options[i].getAttribute('selected') !== null) {
                selectedOptions.push(selectElem.options[i].text);
            }
        }

        if (this.options.multiple === true) {
            return selectedOptions;
        }

        return selectedOptions[0];
    };

    TailSelector.prototype.getSelectedOptionsKeys = function() {
        var selectElem = this.selectorElem;
        var selectedOptions = [];
        for (var i = 0; i < selectElem.length; i++) {
            if (selectElem.options[i].getAttribute('selected') !== null) {
                selectedOptions.push(selectElem.options[i].value);
            }
        }

        if (this.options.multiple === true) {
            return selectedOptions;
        }

        return selectedOptions[0];
    };

    TailSelector.prototype.replaceOptions = function(newSelectOptions) {
        this.selectOptions = newSelectOptions;

        var containerNode = this.selectorElem.parentNode;

        this.tailElem.remove();
        this.selectorElem.parentNode.removeChild(this.selectorElem);

        var newSelectElem = document.createElement('select');
        newSelectElem.classList = 'tt-select';

        if (this.selector.indexOf('#') === 0) {
            newSelectElem.setAttribute('id', this.selector.substring(1));
        } else {
            newSelectElem.classList.add(this.selector.substring(1));
        }

        containerNode.appendChild(newSelectElem);

        init.call(this);
    };

    return TailSelector;
})();

window.TailSelector = window.TailSelector || TailSelector;
