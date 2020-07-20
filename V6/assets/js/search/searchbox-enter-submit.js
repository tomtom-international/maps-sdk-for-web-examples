
function handleEnterSubmit(event, selectionCallback, errorHint, type) {
    if (event.data && event.data.metadata.triggeredBy === 'submit') {
        if (event.data.results && event.data.results.fuzzySearch.results[0]) {
            selectionCallback.call(this, event.data.results.fuzzySearch.results[0], type);
        } else {
            errorHint.setMessage('No result found');
        }
    }
}

window.handleEnterSubmit = window.handleEnterSubmit || handleEnterSubmit;
