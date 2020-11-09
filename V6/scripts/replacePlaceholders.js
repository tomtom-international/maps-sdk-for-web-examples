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

const hostedStylesRegex = new RegExp(`\\\${hostedStylesVersion}`, 'gm'); //eslint-disable-line

const styleRegexes = Object.keys(config.styles).reduce((acc, customStyle) => {
    acc[customStyle] = new RegExp(`\\\${styles.${customStyle}}`, 'gm');
    return acc;
}, {});

const productInfoRegexes = Object.keys(config.productInfo).reduce((acc, key) => {
    acc[key] = new RegExp(`\\\${productInfo.${key}}`, 'gm');
    return acc;
}, {});

const regexes = {
    ...cdnRegexes,
    ...keysRegexes,
    ...styleRegexes,
    ...productInfoRegexes,
    hostedStylesVersion: hostedStylesRegex
};

const values = {
    ...config.cdn,
    ...config.keys,
    ...config.styles,
    ...config.productInfo,
    hostedStylesVersion: config.hostedStylesVersion
};

(async () => {
    const placeholdersToReplace = [];
    const valuesForReplacement = [];

    for (const key in values) {
        placeholdersToReplace.push(regexes[key]);
        valuesForReplacement.push(values[key]);
    }

    await replaceInFile({
        files: [
            path.resolve(__dirname, '../', 'dist/**/*.html')
        ],
        from: placeholdersToReplace,
        to: valuesForReplacement
    });

    console.log('Replace placeholders finished!'); //eslint-disable-line
})();
