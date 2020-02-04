/**
 * Object.assign polyfill
 */

if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
        value: function assign(target) {
            'use strict';
            if (target === null || target === undefined) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource !== null && nextSource !== undefined) {
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

/**
 * Details element polyfill
 */

(function() {
    var DETAILS = 'details';
    var SUMMARY = 'summary';

    var supported = checkSupport();
    if (supported) {
        return;
    }

    // Add a classname
    document.documentElement.className += ' no-details';

    window.addEventListener('click', clickHandler);

    injectStyle('details-polyfill-style',
        'html.no-details ' + DETAILS + ':not([open]) > :not(' + SUMMARY + ') { display: none; }\n' +
        'html.no-details ' + DETAILS + ' > ' + SUMMARY + ':before { content: "\u25b6"; display: inline-block; font-size: .8em; width: 1.5em; }\n' + //eslint-disable-line
        'html.no-details ' + DETAILS + '[open] > ' + SUMMARY + ':before { content: "\u25bc"; }');

    /*
     * Click handler for `<summary>` tags
     */

    function clickHandler(e) {
        if (e.target.nodeName.toLowerCase() === 'summary') {
            var details = e.target.parentNode;
            if (!details) {
                return;
            }

            if (details.getAttribute('open')) {
                details.open = false;
                details.removeAttribute('open');
            } else {
                details.open = true;
                details.setAttribute('open', 'open');
            }
        }
    }

    /*
     * Checks for support for `<details>`
     */

    function checkSupport() {
        var el = document.createElement(DETAILS);
        if (!('open' in el)) {
            return false;
        }

        el.innerHTML = '<' + SUMMARY + '>a</' + SUMMARY + '>b';
        document.body.appendChild(el);

        var diff = el.offsetHeight;
        el.open = true;
        var result = diff !== el.offsetHeight;

        document.body.removeChild(el);
        return result;
    }

    /*
     * Injects styles (idempotent)
     */

    function injectStyle(id, style) {
        if (document.getElementById(id)) {
            return;
        }

        var el = document.createElement('style');
        el.id = id;
        el.innerHTML = style;

        document.getElementsByTagName('head')[0].appendChild(el);
    }
})();
