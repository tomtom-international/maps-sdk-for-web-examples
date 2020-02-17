function appendParentSelector(parentSelector, selector) {
    return parentSelector ? parentSelector + ' ' + selector : selector;
}

/**
 * @description Handles the results tab state.
 * @param {String} resultsElementSelector
 */
function ResultsManager(resultsElementSelector) {
    this.resultsElement = document.querySelector(appendParentSelector(resultsElementSelector, '.js-results'));
    this.resultsPlaceholder =
        document.querySelector(appendParentSelector(resultsElementSelector, '.js-results-placeholder'));
    this.resultsLoader = document.querySelector(appendParentSelector(resultsElementSelector, '.js-results-loader'));
}

ResultsManager.prototype.loading = function() {
    this.resultsLoader.removeAttribute('hidden');
    this.resultsElement.setAttribute('hidden', 'hidden');
    this.resultsPlaceholder.setAttribute('hidden', 'hidden');
    this.resultsElement.innerHTML = '';
};

ResultsManager.prototype.success = function() {
    this.resultsLoader.setAttribute('hidden', 'hidden');
    this.resultsElement.removeAttribute('hidden');
};

ResultsManager.prototype.resultsNotFound = function() {
    this.resultsElement.setAttribute('hidden', 'hidden');
    this.resultsLoader.setAttribute('hidden', 'hidden');
    this.resultsPlaceholder.removeAttribute('hidden');
};

ResultsManager.prototype.append = function(element) {
    this.resultsElement.appendChild(element);
};

ResultsManager.prototype.clear = function() {
    for (var i = 0; i < this.resultsElement.children.length; i++) {
        this.resultsElement.removeChild(this.resultsElement.children[i]);
    }
};

window.ResultsManager = window.ResultsManager || ResultsManager;
