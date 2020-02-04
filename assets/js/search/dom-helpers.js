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
    element.appendChild(resultName);

    if (address) {
        var resultAddress = elementFactory('div', 'tt-search-result__address');
        resultAddress.innerText = address;
        element.appendChild(resultAddress);
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

var DomHelpers = {
    createResultItem: createResultItem,
    createResultList: createResultList,
    createSearchResult: createSearchResult,
    checkIfElementOrItsParentsHaveClass: checkIfElementOrItsParentsHaveClass,
    elementFactory: elementFactory
};

window.DomHelpers = window.DomHelpers || DomHelpers;
