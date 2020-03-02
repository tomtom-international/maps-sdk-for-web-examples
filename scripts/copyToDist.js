const ncp = require('ncp');
const path = require('path');

const source = path.resolve(__dirname, '../', 'html');
const destination = path.resolve(__dirname, '../', 'dist');

//eslint-disable-next-line
console.log("Copying files to dist starting...");

ncp(source, destination, (err) => {
    if (err) {
        console.error(err);
        process.exit(-1);
    }

    //eslint-disable-next-line
    console.log("Copying files to dist finished!");
});
