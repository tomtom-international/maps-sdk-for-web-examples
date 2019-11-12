/**
 * @description Handles the results tab state.
 */
function ResultsManager() {
    this.resultsElement = document.querySelector('.js-results');
    this.resultsPlaceholder = document.querySelector('.js-results-placeholder');
    this.resultsLoader = document.querySelector('.js-results-loader');
}

ResultsManager.prototype.loading = function() {
    this.resultsLoader.removeAttribute('hidden');
    this.resultsElement.setAttribute('hidden', 'hidden');
    this.resultsPlaceholder.setAttribute('hidden', 'hidden');
    this.resultsElement.innerHTML = null;
};

ResultsManager.prototype.success = function() {
    this.resultsLoader.setAttribute('hidden', 'hidden');
    this.resultsElement.removeAttribute('hidden');
};

ResultsManager.prototype.resultsNotFound = function() {
    this.resultsLoader.setAttribute('hidden', 'hidden');
    this.resultsPlaceholder.removeAttribute('hidden');
};

ResultsManager.prototype.append = function(element) {
    this.resultsElement.appendChild(element);
};

window.ResultsManager = window.ResultsManager || ResultsManager;
