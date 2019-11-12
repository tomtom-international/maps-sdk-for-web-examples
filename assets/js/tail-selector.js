if (!window.tail) {
    throw new Error('Tail must be available globally to use the language selector.');
}

function ReplaceWithPolyfill() {
    'use-strict'; // For safari, and IE > 10
    var parent = this.parentNode, i = arguments.length, currentNode;
    if (!parent) return;
    if (!i) // if there are no arguments
        parent.removeChild(this);
    while (i--) { // i-- decrements i and returns the value of i before the decrement
        currentNode = arguments[i];
        if (typeof currentNode !== 'object'){
            currentNode = this.ownerDocument.createTextNode(currentNode);
        } else if (currentNode.parentNode){
            currentNode.parentNode.removeChild(currentNode);
        }
        // the value of "i" below is after the decrement
        if (!i) // if currentNode is the first argument (currentNode === arguments[0])
            parent.replaceChild(currentNode, this);
        else // if currentNode isn't the first
            parent.insertBefore(currentNode, this.previousSibling);
    }
}
if (!Element.prototype.replaceWith)
    Element.prototype.replaceWith = ReplaceWithPolyfill;
if (!CharacterData.prototype.replaceWith)
    CharacterData.prototype.replaceWith = ReplaceWithPolyfill;
if (!DocumentType.prototype.replaceWith)
    DocumentType.prototype.replaceWith = ReplaceWithPolyfill;

var TailSelector = (function() {
    function TailSelector(selectOptions, selector, defaultKey, options) {
        this.selectOptions = selectOptions;
        this.defaultKey = defaultKey;
        this.options = options;

        this.selectorElem = createSelectElement.call(this);
        appendOptions.call(this, this.selectorElem);

        this.element = document.querySelector(selector);
        this.element.replaceWith(this.selectorElem);

        this.tailElem = convertToTail.call(this);
    }

    TailSelector.prototype.getElement = function() {
        return this.tailElem;
    };

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
            assign({
                classNames: 'tt-fake-select',
                hideSelected: true
            }, this.options
        ));

        tailSelect.options.select(this.defaultKey, '#');
        return tailSelect;
    }

    function assign() {
        var newObj = arguments[0];
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    newObj[prop] = obj[prop];
                }
            }
        }
        return newObj;
    }

    return TailSelector;
})();

window.TailSelector = window.TailSelector || TailSelector;
