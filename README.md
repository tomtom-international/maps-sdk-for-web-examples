# Maps SDK for Web Examples

## Documentation

Please refer to *https://developer.tomtom.com* for detailed documentation with examples.
Also latest version of the SDK can be found there.

## Getting started

To run examples on your local machine you need to install [node.js](https://nodejs.org).
Use the latest LTS version available in the download section.

Before being able to check out examples you need to provide proper API Keys for services like search, maps, etc.
Together with the examples we have provided node.js script, which will help you to automatically replace them.
1. Open config.json.
2. There are placeholders for every type of key; replace them accordingly.
3. Open a terminal or command line tool in the same folder.
4. `npm install`, this will install all npm modules necessary to run examples in offline mode.
5. `npm run build`, this command will run the provided script and replace placeholders with your keys.
6. `npm start`, this will start a http server which will serve files. Open the browser, choose dist directory and click on one of the html files.
7. The server should start at https://localhost:8080 (if the port was already in use, check your console - http server prints
   what port it is running on), you can open it in the browser.
