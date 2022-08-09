import {createRequire} from "module";

const require = createRequire(import.meta.url);
// load up env variables from the .env file
require('dotenv').config()

const http = require('http');
const fs = require('fs');
const url = require('url');
const figlet = require('figlet');

import {fileTypes} from "./file.js";
import {apiHandler} from "./api.js";


const server = http.createServer((req, res) => {
    // if protocol is undefined, default to http for now
    const base = ((req.protocol) ? req.protocol : "http") + '://' + req.headers.host + '/'
    const fullURL = new url.URL(req.url, base)
    const page = fullURL.pathname
    const params = fullURL.searchParams
    if (page === "/api"){
        handleRes(undefined, params, res, undefined, true, false);
    } else {
        returnFile(page, res)
    }
})

/**
 * Makes sure there is a file in the correct location (hardcoded to public for now), if so then serve
 * the file.
 * @param {string} tmpFile
 * @param {module:http.ServerResponse} res
 */
function returnFile(tmpFile, res) {
    // account for index.html being the root page
    let file = (tmpFile === "/") ? "/index.html" : tmpFile
    // if the file exists in the public folder, serve it
    if (fileExists(`public${file}`)) {
        fs.readFile(`public${file}`, (err, data) => handleRes(err, data, res, file, true, true))
    } else {
        figlet('404!!', (err, data) => handleRes(err, data, res, file, false, true));
    }
}

/**
 * @param {string} path to check if file exists
 */
function fileExists(path) {
    try {
        fs.accessSync(path, fs.constants.F_OK)
    } catch {
        return false
    }
    return true
}

// TODO: Might be better to break this into multiple functions, as it
//  takes 7 parameters.
/**
 * Handles Response code, sends back the data to the client. Look at the filetypes object in file.js for
 * the possible types that this function serves.
 * @param {NodeJS.ErrnoException} err Nodejs error, something went awful if this is not falsy
 * @param {Buffer} data data that was read from file
 * @param {module:http.ServerResponse} res the response object, used to send back data to the client
 * @param {string} file filepath used to check for filetype
 * @param {boolean} success if the file was found this will be true allowing for the server to serve the file
 * in question
 * @param {boolean} isFile checks if we are sending a file or if its a api request. Handle Response will then cover both cases
 */
 function handleRes(err, data, res, file, success, isFile) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    } else if (success) {
        // the content type to use. should never be undefined
        let suffix = (isFile) ? file.split('.')[1] : "json"
        let cType = fileTypes[suffix] //splits the string into an array of 2 elements, from wherever '.' is and returns the extension
        // just in case it is, set make sure there is a value
        if (!cType) {
            cType = ""
        }
        res.writeHead(200, {'Content-Type': cType});
    } else {
        res.writeHead(404)
    }
    if (isFile) {
        res.write(data);
        res.end();
    } else {
        // we are sending json back to the client
        apiHandler(data).then((d) => res.end(JSON.stringify(d)))
    }
}

server.listen(8000);
