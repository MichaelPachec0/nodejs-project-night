import {createRequire} from "module";
const require = createRequire(import.meta.url);

const http = require('http');
const fs = require('fs');
const url = require('url');
const figlet = require('figlet');

import {fileTypes} from "./file.js";


const server = http.createServer((req, res) =>{
    // if protocol is undefined, default to http for now
    const base = ((req.protocol)? req.protocol : "http") + '://' + req.headers.host + '/'
    const page = new url.URL(req.url, base).pathname
    const params = new URLSearchParams(page.search)
    if (page === "/api"){
        // TODO: handle api here
    } else {
        returnFile(page, res)
    }
})

/**
 * @param {string} tmpFile
 * @param {module:http.ServerResponse} res
 */
function returnFile(tmpFile, res) {
    // account for index.html being the root page
    let file = (tmpFile === "/") ? "/index.html" : tmpFile
    // if file exists in the public folder, serve it
    if (fileExists(`public${file}`)){
        fs.readFile(`public${file}`, (err, data) => handleRes(err, data, res, file, true))
    } else {
        figlet('404!!', (err, data) => handleRes(err, data, res,file, false));
    }
}
/**
 * @param {string} path
 */
function fileExists(path) {
    try {
        fs.accessSync(path, fs.constants.F_OK)
    } catch {
        return false
    }
    return true
}
/**
 * @param {NodeJS.ErrnoException} err
 * @param {Buffer} data
 * @param {module:http.ServerResponse} res
 * @param {string} file
 * @param {boolean} success
 */
function handleRes(err, data, res, file, success ){
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    } else if (success){
        let cType = fileTypes[file.replace(/^\/?.*?\./g,"")]
        if (!cType){
            cType = ""
        }
        res.writeHead(200, {'Content-Type':  cType});
    } else {
        res.writeHead(404)
    }
    res.write(data);
    res.end();
}

server.listen(8000);