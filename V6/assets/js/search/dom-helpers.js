function elementFactory(type, className, content) {
    var element = document.createElement(type);
    element.setAttribute('class', className);
    if (typeof content !== 'undefined') {
        element.textContent = content;
    }
    return element;
}

function createResultItem() {
    return elementFactory('li', 'tt-results-list__item');
}

function createResultList() {
    return elementFactory('ul', 'tt-results-list');
}

function createSearchResult(name, address, distance) {
    var resultName = elementFactory('div', 'tt-search-result__name');
    resultName.innerText = name;
    var element = elementFactory('div', 'tt-search-result');
    var infoElement = elementFactory('div');
    infoElement.appendChild(resultName);
    element.appendChild(infoElement);

    if (address) {
        var resultAddress = elementFactory('div', 'tt-search-result__address');
        resultAddress.innerText = address;
        infoElement.appendChild(resultAddress);
    }

    if (distance) {
        var resultDistance = elementFactory('div', 'tt-search-result__distance');
        resultDistance.innerText = distance;
        element.appendChild(resultDistance);
    }

    return element;
}

function checkIfElementOrItsParentsHaveClass(element, className) {
    if (element.classList.contains(className)) {
        return true;
    }
    while (element.parentNode) {
        element = element.parentNode;
        if (element.classList && element.classList.contains(className)) {
            return true;
        }
    }
    return false;
}

function getElementOrItsParentId(element) {
    if (element.id) {
        return element.id;
    }
    while (element.parentNode) {
        element = element.parentNode;
        if (element.id) {
            return element.id;
        }
    }
    return false;
}

var DomHelpers = {
    createResultItem: createResultItem,
    createResultList: createResultList,
    createSearchResult: createSearchResult,
    checkIfElementOrItsParentsHaveClass: checkIfElementOrItsParentsHaveClass,
    getElementOrItsParentId: getElementOrItsParentId,
    elementFactory: elementFactory
};

window.DomHelpers = window.DomHelpers || DomHelpers;
