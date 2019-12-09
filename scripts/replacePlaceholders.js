const replaceInFile = require('replace-in-file');
const path = require('path');
const config = require('../config');

console.log('Replace placeholders starting...'); //eslint-disable-line

const cdnRegexes = Object.keys(config.cdn).reduce((acc, key) => {
    acc[key] = new RegExp(`/cdn.${key}`, 'gm');
    return acc;
}, {});

const keysRegexes = Object.keys(config.keys).reduce((acc, key) => {
    acc[key] = new RegExp(`\\\${api.key.${key}}`, 'gm');
    return acc;
}, {});

const regexes = {...cdnRegexes, ...keysRegexes};
const values = {...config.cdn, ...config.keys};

(async () => {
    const placeholdersToReplace = [];
    const valuesForReplacement = [];

    for (const key in values) {
        placeholdersToReplace.push(regexes[key]);
        valuesForReplacement.push(values[key]);
    }

    await replaceInFile({
        files: path.resolve(__dirname, '../', 'dist/**/*.html'),
        from: placeholdersToReplace,
        to: valuesForReplacement
    });

    console.log('Replace placeholders finished!'); //eslint-disable-line
})();
