function DomHelpers() {}

function elementFactory(type, className) {
    var element = document.createElement(type);
    element.setAttribute('class', className);
    return element;
};

function createResultItem() {
    return elementFactory('li', 'tt-results-list__item');
};

function createResultList() {
    return elementFactory('ul', 'tt-results-list');
};

function createSearchResult(name, address, distance) {
    var resultName = elementFactory('div', 'tt-search-result__name');
    var resultAddress = elementFactory('div', 'tt-search-result__address');
    resultName.innerText = name;
    resultAddress.innerText = address;

    var element = elementFactory('div', 'tt-search-result');

    element.appendChild(resultName);
    element.appendChild(resultAddress);

    if (distance) {
        var resultDistance = elementFactory('div', 'tt-search-result__distance');
        resultDistance.innerText = distance;
        element.appendChild(resultDistance);
    }

    return element;
};

var DomHelpers = {
    createResultItem: createResultItem,
    createResultList: createResultList,
    createSearchResult: createSearchResult
};


window.DomHelpers = window.DomHelpers || DomHelpers;
